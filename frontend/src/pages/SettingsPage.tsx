// frontend/src/pages/SettingsPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getMyProfile, updateMyProfile } from "@/api/authApi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastAction } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";

const SettingsPage = () => {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const profileFormSchema = z.object({
    name: z
      .string()
      .min(1, t("errors.validation.required"))
      .max(50, t("errors.validation.maxLength", { count: 50 })),
    handle: z
      .string()
      .min(3, t("errors.validation.minLength", { count: 3 }))
      .max(30, t("errors.validation.maxLength", { count: 30 }))
      .regex(/^[a-zA-Z0-9_]+$/, t("errors.validation.invalidHandle")),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return getMyProfile(token);
    },
  });

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    values: {
      name: data?.user.name || "",
      handle: data?.user.handle || "",
    },
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof profileFormSchema>) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return updateMyProfile(token, values);
    },
    onSuccess: (updatedData) => {
      const newHandle = updatedData.user.handle;
      const profileUrl = newHandle
        ? `${window.location.origin}/${newHandle}`
        : "";

      toast({
        title: t("settings.saveSuccess"),
        description: t("settings.sharePrompt.description"),
        action: (
          <ToastAction
            altText={t("settings.sharePrompt.copy")}
            onClick={() => {
              if (profileUrl) navigator.clipboard.writeText(profileUrl);
            }}
          >
            {t("settings.sharePrompt.copy")}
          </ToastAction>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: (error: any) => {
      toast({
        title: t("settings.saveError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    mutate(values);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-24 self-end" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-mono text-2xl md:text-3xl font-bold mb-8">
        {t("settings.title")}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono">
                  {t("settings.displayName.label")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("settings.displayName.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t("settings.displayName.description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="handle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono">
                  {t("settings.handle.label")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("settings.handle.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t("settings.handle.description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="font-mono">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("common.saveChanges")}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SettingsPage;
