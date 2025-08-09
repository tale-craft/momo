// frontend/src/pages/QuestionPage.tsx
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getQuestionById, addQuestionReply } from "@/api/questionApi";
import { getMyProfile } from "@/api/authApi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, ArrowLeft, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/shadcn-utils";
import { ApiError } from "@/api/apiClient";

const QuestionPage = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const { getToken, userId } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [replyContent, setReplyContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: myProfile, isLoading: isLoadingMyProfile } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => getToken().then((token) => getMyProfile(token!)),
    enabled: !!userId,
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["question", questionId],
    queryFn: async () => getQuestionById(await getToken(), questionId!),
    enabled: !!questionId,
    retry: (failureCount, error) =>
      (error as ApiError)?.status >= 500 && failureCount < 3,
  });

  const { mutate: sendReply, isPending: isSending } = useMutation({
    mutationFn: async (content: string) => {
      const token = await getToken();
      return addQuestionReply(token, questionId!, { content });
    },
    onSuccess: () => {
      setReplyContent("");
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });
    },
    onError: (err: any) =>
      toast({
        title: t("common.error"),
        description: err.message,
        variant: "destructive",
      }),
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) sendReply(replyContent.trim());
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.question.replies]);

  if (isLoading || (userId && isLoadingMyProfile))
    return <Skeleton className="h-96 w-full max-w-3xl mx-auto" />;

  const question = data?.question;
  if (isError || !question) {
    const apiError = error as ApiError;
    return (
      <div className="text-center py-20 font-mono text-xl text-destructive-foreground bg-destructive/80 rounded-lg max-w-3xl mx-auto">
        {apiError?.status === 404
          ? t("question.notFound")
          : t("question.accessDenied")}
      </div>
    );
  }

  const canReply =
    question.viewer_permission === "asker" ||
    question.viewer_permission === "receiver";
  const me = myProfile?.user;
  const conversationThread = [
    {
      id: "initial_question",
      isInitial: true,
      content: question.content,
      created_at: question.created_at,
      sender_name: question.asker_name || t("common.anonymous"),
      sender_avatar: question.is_private ? undefined : question.asker_avatar,
      sender_id: question.asker_id,
    },
    ...(question.replies || []).map((r) => ({ ...r, isInitial: false })),
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("common.goBack")}
      </Button>
      <div className="flex flex-col border rounded-lg h-[calc(100vh-12rem)]">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {conversationThread.map((item) => {
            let isMyMessage = false;
            if (question.viewer_permission === "receiver")
              isMyMessage = item.sender_id === me?.id;
            else if (question.viewer_permission === "asker")
              isMyMessage =
                item.sender_id === me?.id ||
                (item.isInitial && !item.sender_id);

            const avatarUrl = isMyMessage ? me?.avatar_url : item.sender_avatar;
            const senderName = isMyMessage ? t("common.you") : item.sender_name;
            const fallback = senderName?.[0] || (
              <UserIcon className="h-4 w-4" />
            );

            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-end gap-3",
                  isMyMessage && "justify-end"
                )}
              >
                {!isMyMessage && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>{fallback}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-md rounded-lg px-4 py-2",
                    isMyMessage
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm font-sans break-words">
                    {item.content}
                  </p>
                </div>
                {isMyMessage && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>{fallback}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        {canReply && (
          <div className="p-4 border-t bg-card">
            <form onSubmit={handleSendReply} className="flex items-start gap-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={t("bottle.message.placeholder")}
                className="min-h-[40px] max-h-[120px] resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendReply(e);
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isSending || !replyContent.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default QuestionPage;
