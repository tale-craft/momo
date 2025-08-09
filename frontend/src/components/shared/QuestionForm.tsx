// frontend/src/components/shared/QuestionForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { askQuestion } from "@/api/questionApi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { FileUploader } from "./FileUploader";
import { Loader2 } from "lucide-react";

interface QuestionFormProps {
  receiverHandle: string;
}

export function QuestionForm({ receiverHandle }: QuestionFormProps) {
  const { isSignedIn, getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const formSchema = z.object({
    content: z
      .string()
      .min(5, t("errors.validation.minLength", { count: 5 }))
      .max(500, t("errors.validation.maxLength", { count: 500 })),
    isPrivate: z.boolean().default(false),
    images: z
      .array(z.string().url())
      .max(3, t("errors.validation.maxImages", { count: 3 }))
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      isPrivate: false,
      images: [],
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const token = await getToken();
      return askQuestion(token, { ...values, receiverHandle });
    },
    onSuccess: () => {
      toast({
        title: t("notifications.question.sent"),
        description: t("notifications.question.sentDescription"),
      });
      form.reset();
      // 使与此用户相关的问题查询失效，以重新获取数据
      queryClient.invalidateQueries({
        queryKey: ["questions", receiverHandle],
      });
    },
    onError: (error) => {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  const handleUploadSuccess = (url: string) => {
    const currentImages = form.getValues("images") || [];
    form.setValue("images", [...currentImages, url]);
  };

  const handleRemoveImage = (url: string) => {
    const currentImages = form.getValues("images") || [];
    form.setValue(
      "images",
      currentImages.filter((imgUrl) => imgUrl !== url)
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-4 sm:p-6 border rounded-lg bg-card"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-lg">
                {t("question.ask")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("question.placeholder", {
                    handle: receiverHandle,
                  })}
                  className="min-h-[120px] font-sans"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FileUploader
                onUploadSuccess={handleUploadSuccess}
                onRemove={handleRemoveImage}
                uploadedUrls={field.value || []}
                maxFiles={3}
              />
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
          <FormField
            control={form.control}
            name="isPrivate"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!isSignedIn}
                  />
                </FormControl>
                <FormLabel className="font-sans text-sm">
                  {t("question.private")}
                </FormLabel>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="font-mono w-full sm:w-auto"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("common.submitQuestion")}
          </Button>
        </div>
        {!isSignedIn && (
          <p className="text-xs text-muted-foreground font-sans text-center">
            <a href="/sign-in" className="text-primary underline">
              {t("question.privateHintSignIn")}
            </a>
            {t("question.privateHintRemainder")}
          </p>
        )}
      </form>
    </Form>
  );
}
