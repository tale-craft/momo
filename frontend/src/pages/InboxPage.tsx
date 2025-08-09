// frontend/src/pages/InboxPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom"; // 新增
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getQuestionStats, getInboxQuestions } from "@/api/questionApi";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/shared/QuestionCard";
import { Question } from "@/types";
import { cn } from "@/lib/shadcn-utils";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatusFilter = "all" | "pending" | "answered";

const InboxPage = () => {
  const { getToken } = useAuth();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<StatusFilter>("all");

  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["questionStats"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return getQuestionStats(token);
    },
  });

  const { data: questionsData, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["inboxQuestions", filter],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return getInboxQuestions(token, { status: filter });
    },
  });

  const StatCard = ({
    title,
    value,
    isLoading,
  }: {
    title: string;
    value?: number;
    isLoading: boolean;
  }) => (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {isLoading ? (
          <Skeleton className="h-8 w-1/2" />
        ) : (
          <div className="text-2xl font-bold">{value ?? 0}</div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
      <h1 className="font-mono text-2xl md:text-3xl font-bold">
        {t("inbox.title")}
      </h1>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <StatCard
          title={t("inbox.total")}
          value={statsData?.stats.total}
          isLoading={isLoadingStats}
        />
        <StatCard
          title={t("inbox.pending")}
          value={statsData?.stats.pending}
          isLoading={isLoadingStats}
        />
        <StatCard
          title={t("inbox.answered")}
          value={statsData?.stats.answered}
          isLoading={isLoadingStats}
        />
        <StatCard
          title={t("inbox.private")}
          value={statsData?.stats.private}
          isLoading={isLoadingStats}
        />
      </div>

      <div>
        <div className="flex space-x-1 border-b mb-4 overflow-x-auto">
          {(["all", "pending", "answered"] as StatusFilter[]).map((f) => (
            <Button
              key={f}
              variant="ghost"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-none flex-shrink-0",
                filter === f
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground"
              )}
            >
              {t(
                `inbox.filter${f.charAt(0).toUpperCase() + f.slice(1)}` as any
              )}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {isLoadingQuestions ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))
          ) : questionsData && questionsData.questions.length > 0 ? (
            questionsData.questions.map((q: Question) => (
              <Link to={`/q/${q.id}`} key={q.id} className="block">
                <QuestionCard question={q} isLink={false} />
              </Link>
            ))
          ) : (
            <div className="text-center py-10 border-2 border-dashed rounded-lg mt-4">
              <p className="font-mono text-muted-foreground">
                {t("inbox.noQuestions")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InboxPage;
