// src/pages/BottlesPage.tsx
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { createBottle, pickBottle, getMyBottles } from "@/api/bottleApi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Send,
  Sailboat,
  Plus,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { User } from "@/types";

const BottlesPage = () => {
  const [isThrowing, setIsThrowing] = useState(false);
  const { getToken } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const bottleFormSchema = z.object({
    content: z
      .string()
      .min(1, t("errors.validation.required"))
      .max(500, t("errors.validation.maxLength", { count: 500 })),
  });

  // Mutation for creating a new bottle
  const createBottleMutation = useMutation({
    mutationFn: (data: { content: string }) => {
      const token = getToken();
      return token.then((t) => createBottle(t!, data));
    },
    onSuccess: () => {
      toast({
        title: t("common.success"),
        description: t("notifications.bottle.thrown"),
      });
      setIsThrowing(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["myBottles"] });
    },
    onError: (error: any) => {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for picking a bottle
  const pickBottleMutation = useMutation({
    mutationFn: () => {
      const token = getToken();
      return token.then((t) => pickBottle(t!));
    },
    onSuccess: (data) => {
      toast({ title: t("notifications.bottle.picked") });
      navigate(`/bottles/${data.bottle.id}`);
    },
    onError: (error: any) => {
      toast({
        title: t("bottle.ocean.quietTitle"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Query for user's bottles
  const { data: myBottlesData, isLoading: isLoadingMyBottles } = useQuery({
    queryKey: ["myBottles"],
    queryFn: () => getToken().then((t) => getMyBottles(t!)),
  });

  const form = useForm<z.infer<typeof bottleFormSchema>>({
    resolver: zodResolver(bottleFormSchema),
    defaultValues: { content: "" },
  });

  function onThrowSubmit(values: z.infer<typeof bottleFormSchema>) {
    createBottleMutation.mutate(values);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="text-center p-8 border border-dashed rounded-lg bg-card">
        <Sailboat className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-mono text-4xl font-bold">
          {t("bottle.ocean.title")}
        </h1>
        <p className="text-muted-foreground mt-2 mb-6 font-sans">
          {t("bottle.ocean.subtitle")}
        </p>
        <div className="flex justify-center gap-4">
          <Dialog open={isThrowing} onOpenChange={setIsThrowing}>
            <DialogTrigger asChild>
              <Button size="lg" className="font-mono">
                <Plus className="mr-2 h-5 w-5" />
                {t("bottle.throw")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("bottle.throwTitle")}</DialogTitle>
                <DialogDescription>
                  {t("bottle.throwDescription")}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onThrowSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder={t("bottle.throwPlaceholder")}
                            {...field}
                            className="min-h-[150px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={createBottleMutation.isPending}
                      className="font-mono w-full"
                    >
                      {createBottleMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {t("bottle.castToOcean")}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Button
            size="lg"
            variant="outline"
            className="font-mono"
            onClick={() => pickBottleMutation.mutate()}
            disabled={pickBottleMutation.isPending}
          >
            {pickBottleMutation.isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Package className="mr-2 h-5 w-5" />
            )}
            {t("bottle.pick")}
          </Button>
        </div>
      </section>

      <section>
        <h2 className="font-mono text-2xl font-bold mb-4">
          {t("bottle.conversations")}
        </h2>
        {isLoadingMyBottles ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        ) : myBottlesData && myBottlesData.bottles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myBottlesData.bottles.map((bottle) => (
              <Link to={`/bottles/${bottle.id}`} key={bottle.id}>
                <Card className="hover:border-primary transition-colors h-full">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{t("bottle.conversationLabel")}</span>
                      <MessageCircle className="h-5 w-5 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-sans line-clamp-2">
                      {t("bottle.chat", {
                        name:
                          bottle.creator_name === "You"
                            ? bottle.picker_name
                            : bottle.creator_name || "...",
                      })}
                    </p>
                    <p className="text-xs text-primary font-mono mt-2">
                      {t(`bottle.status.${bottle.status}` as const)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="font-mono text-muted-foreground">
              {t("bottle.noConversations")}
            </p>
            <p className="font-sans text-sm text-muted-foreground">
              {t("bottle.startConversation")}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default BottlesPage;
