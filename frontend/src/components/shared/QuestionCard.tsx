// frontend/src/components/shared/QuestionCard.tsx
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Question } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CornerDownRight, Lock, MessageSquare } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  isLink?: boolean;
}

export function QuestionCard({ question, isLink = true }: QuestionCardProps) {
  const { t } = useTranslation();

  const askerName = question.is_private
    ? t("common.anonymous")
    : question.asker_name || t("common.anonymous");

  const askerAvatar = question.is_private
    ? undefined // 私密问题不显示提问者头像
    : question.asker_avatar;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(t("language"), {
      month: "short",
      day: "numeric",
    });
  };

  const lastReply = question.replies?.[question.replies.length - 1];

  const CardContent = (
    <div className="bg-card p-4 sm:p-6 transition-all group-hover:bg-accent/50">
      <div className="flex flex-col space-y-4">
        {/* Question Part */}
        <div className="flex items-start space-x-3 sm:space-x-4">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
            <AvatarImage src={askerAvatar} alt={askerName} />
            <AvatarFallback>{askerName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-mono text-sm font-semibold">{askerName}</p>
              <time className="font-sans text-xs text-muted-foreground">
                {formatDate(question.created_at)}
              </time>
            </div>
            <p className="mt-1 font-sans text-foreground break-words">
              {question.content}
            </p>
            <div className="flex items-center justify-between mt-2">
              {question.is_private && (
                <span className="inline-flex items-center text-xs font-mono bg-secondary text-secondary-foreground px-2 py-1 rounded">
                  <Lock className="h-3 w-3 mr-1.5" />
                  {t("question.status.private")}
                </span>
              )}
              {/* 显示回复数 */}
              <span className="flex-grow"></span>
              <span className="text-xs text-muted-foreground font-sans inline-flex items-center">
                <MessageSquare className="h-3 w-3 mr-1.5" />
                {question.replies?.length || 0} {t("inbox.replies")}
              </span>
            </div>
          </div>
        </div>

        {/* Last Reply Preview */}
        {lastReply && (
          <div className="pl-8 sm:pl-10 flex items-start space-x-3 sm:space-x-4">
            <CornerDownRight className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
            <div className="flex-1 bg-accent/50 p-3 rounded-md overflow-hidden">
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={lastReply.sender_avatar} />
                  <AvatarFallback>{lastReply.sender_name?.[0]}</AvatarFallback>
                </Avatar>
                <p className="font-sans text-sm text-foreground truncate">
                  {lastReply.content}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isLink) {
    return (
      <Link
        to={`/q/${question.id}`}
        className="block group rounded-lg border overflow-hidden"
      >
        {CardContent}
      </Link>
    );
  }

  return <div className="rounded-lg border overflow-hidden">{CardContent}</div>;
}
