// src/pages/ProfilePage.tsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { getPublicProfileByHandle, getUserQuestions } from "@/api/userApi";
import { getMyProfile } from "@/api/authApi";
import { QuestionForm } from "@/components/shared/QuestionForm";
import { QuestionCard } from "@/components/shared/QuestionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { ApiError } from "@/api/apiClient";

const ProfilePage = () => {
  const { handle } = useParams<{ handle: string }>();
  const { getToken, userId: clerkId } = useAuth();
  const { t } = useTranslation();

  // Fetch the public profile of the user whose page this is
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["profile", handle],
    queryFn: () => getPublicProfileByHandle(handle!),
    enabled: !!handle,
    retry: (failureCount, error) =>
      (error as ApiError)?.status !== 404 && failureCount < 3,
  });

  // Fetch my own profile to check for ownership
  const { data: myProfileData } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) return null;
      return getMyProfile(token);
    },
    enabled: !!clerkId, // Only fetch if I'm logged in
  });

  // Fetch the questions for this user
  const { data: questionsData, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["questions", handle],
    queryFn: async () => {
      const token = await getToken();
      return getUserQuestions(handle!, token);
    },
    enabled: !!handle,
  });

  if (isLoadingProfile) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    );
  }

  if (isProfileError || !profileData?.user) {
    return (
      <div className="text-center py-20 font-mono text-xl">
        {t("errors.userNotFound", { handle })}
      </div>
    );
  }

  const user = profileData.user;
  const isOwner = myProfileData?.user.id === user.id;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* User Header */}
      <div className="flex flex-col items-center text-center space-y-4">
        <Avatar className="h-24 w-24 border-4 border-primary/20">
          <AvatarImage src={user.avatar_url} alt={user.name || ""} />
          <AvatarFallback className="bg-muted">
            <User className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-mono text-4xl font-bold">{user.name}</h1>
          <p className="font-mono text-muted-foreground">@{user.handle}</p>
        </div>
      </div>

      {/* Question Form */}
      {!isOwner && <QuestionForm receiverHandle={handle!} />}

      {/* Questions List */}
      <div className="space-y-4">
        {isLoadingQuestions && <Skeleton className="h-40 w-full" />}
        {questionsData?.questions.map((q) => (
          // [修正] 移除了 isOwner 属性，因为它不再被 QuestionCard 组件接受
          <QuestionCard key={q.id} question={q} />
        ))}
        {questionsData?.questions.length === 0 && !isLoadingQuestions && (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="font-mono text-muted-foreground">
              {t("profile.noQuestions")}
            </p>
            {!isOwner && (
              <p className="font-sans text-sm text-muted-foreground">
                {t("profile.beFirstToAsk")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
