// frontend/src/pages/HomePage.tsx
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getRecentQuestions } from "@/api/questionApi";
import { getMyProfile } from "@/api/authApi";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/shared/QuestionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { SignedIn, SignedOut, SignInButton, useAuth } from "@clerk/clerk-react";
import { ShareBoard } from "@/components/shared/ShareBoard";

const HomePage = () => {
  const { isSignedIn, getToken } = useAuth();
  const { t } = useTranslation();

  const { data: recentQuestions, isLoading: isLoadingRecent } = useQuery({
    queryKey: ["recentQuestions"],
    queryFn: getRecentQuestions,
  });

  const { data: myProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) return null;
      return getMyProfile(token);
    },
    enabled: isSignedIn,
  });

  return (
    <div className="container mx-auto max-w-4xl py-6 md:py-12">
      <section className="text-center mb-16 md:mb-24">
        <h1 className="font-mono text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter mb-4">
          {t("home.title")}
        </h1>
        <p className="max-w-xl mx-auto text-muted-foreground font-sans text-md md:text-lg mb-8">
          {t("home.subtitle")} <br />
          {t("home.description")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <SignedIn>
            <Button asChild size="lg" className="font-mono">
              <Link to={"/inbox"}>{t("nav.inbox")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-mono">
              <Link to="/bottles">{t("home.enterOcean")}</Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" fallbackRedirectUrl="/auth-callback">
              <Button size="lg" className="font-mono">
                {t("home.createBoard")}
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </section>

      <SignedIn>
        <section className="mb-16 md:mb-24">
          <ShareBoard
            handle={myProfile?.user.handle}
            isLoading={isLoadingProfile}
          />
        </section>
      </SignedIn>

      <section>
        <h2 className="font-mono text-2xl md:text-3xl font-bold mb-8 text-center">
          {t("home.latestQA")}
        </h2>
        {isLoadingRecent && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        )}
        {recentQuestions && recentQuestions.questions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentQuestions.questions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        ) : (
          !isLoadingRecent && (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
              <p className="font-mono text-muted-foreground">
                {t("home.noQuestions")}
              </p>
            </div>
          )
        )}
      </section>
    </div>
  );
};

export default HomePage;
