// src/pages/AuthCallbackPage.tsx
import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { syncUser } from "@/api/authApi";
import { formatUserForBE } from "@/lib/clerk";
import { Loader2 } from "lucide-react";

const AuthCallbackPage = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const formattedUser = formatUserForBE(user);
      if (!formattedUser) throw new Error("User data not available.");

      const token = await getToken();
      if (!token) throw new Error("Authentication token not available.");

      return syncUser(token, formattedUser);
    },
    onSuccess: () => {
      // Sync successful, redirect to home.
      navigate("/");
    },
    onError: (error) => {
      console.error("Failed to sync user:", error);
      // Even if sync fails, user is logged in on Clerk's side.
      // Redirect to home so they can use the app. Sync might be retried later.
      navigate("/");
    },
  });

  useEffect(() => {
    // Once the user object is loaded from Clerk, trigger the mutation
    if (isLoaded && user) {
      mutate();
    }
  }, [isLoaded, user, mutate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="mt-4 font-mono text-muted-foreground">
        {t("auth.finalizingSession")}
      </p>
    </div>
  );
};

export default AuthCallbackPage;
