// src/pages/BottleChatPage.tsx
import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  getBottleDetails,
  sendBottleMessage,
  releaseBottle,
} from "@/api/bottleApi";
import { getMyProfile } from "@/api/authApi";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/shadcn-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, CornerUpLeft, Loader2 } from "lucide-react";

const BottleChatPage = () => {
  const { id: bottleId } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const messageSchema = z.object({
    content: z.string().min(1).max(500),
  });

  // Fetch my profile to know my user ID
  const { data: myProfile } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => getToken().then((t) => getMyProfile(t!)),
  });
  const myUserId = myProfile?.user.id;

  // Fetch bottle details
  const {
    data: bottleData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bottle", bottleId],
    queryFn: () => getToken().then((t) => getBottleDetails(t!, bottleId!)),
    enabled: !!bottleId,
  });

  // Mutation for sending a message
  const sendMessageMutation = useMutation({
    mutationFn: (data: { content: string }) => {
      return getToken().then((t) => sendBottleMessage(t!, bottleId!, data));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bottle", bottleId] });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: t("bottle.message.sendError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for releasing the bottle
  const releaseBottleMutation = useMutation({
    mutationFn: () => getToken().then((t) => releaseBottle(t!, bottleId!)),
    onSuccess: () => {
      toast({
        title: t("notifications.bottle.released"),
        description: t("notifications.bottle.releasedDescription"),
      });
      navigate("/bottles");
    },
    onError: (error: any) => {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [bottleData?.bottle.messages]);

  const onSubmit = (values: z.infer<typeof messageSchema>) => {
    sendMessageMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (isError || !bottleData) {
    return (
      <div className="text-center py-20 font-mono text-xl">
        {t("bottle.loadError")}
      </div>
    );
  }

  const { bottle } = bottleData;
  const otherPerson =
    bottle.creator_id === myUserId
      ? { name: bottle.picker_name, avatar: bottle.picker_avatar }
      : { name: bottle.creator_name, avatar: bottle.creator_avatar };

  const canRelease =
    bottle.status === "picked" && bottle.picker_id === myUserId;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={otherPerson.avatar} />
            <AvatarFallback>{otherPerson.name?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <h2 className="font-mono text-xl font-bold">
            {t("bottle.chat", {
              name: otherPerson.name || t("common.aStranger"),
            })}
          </h2>
        </div>
        {canRelease && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => releaseBottleMutation.mutate()}
            disabled={releaseBottleMutation.isPending}
          >
            <CornerUpLeft className="mr-2 h-4 w-4" />
            {t("bottle.release")}
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {bottle.messages?.map((message) => {
          const isMine = message.sender_id === myUserId;
          return (
            <div
              key={message.id}
              className={cn("flex items-end gap-3", isMine && "justify-end")}
            >
              {!isMine && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender_avatar} />
                  <AvatarFallback>
                    {message.sender_name?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-md rounded-lg px-4 py-2",
                  isMine ? "bg-primary text-primary-foreground" : "bg-muted"
                )}
              >
                <p className="text-sm font-sans">{message.content}</p>
              </div>
              {isMine && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={myProfile?.user.avatar_url} />
                  <AvatarFallback>
                    {myProfile?.user.name?.[0] || t("common.you")}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t bg-card">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-4"
        >
          <Input
            {...form.register("content")}
            placeholder={t("bottle.message.placeholder")}
            autoComplete="off"
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={sendMessageMutation.isPending}
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BottleChatPage;
