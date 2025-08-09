// frontend/src/components/shared/ShareBoard.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareBoardProps {
  handle: string | undefined | null;
  isLoading: boolean;
}

export function ShareBoard({ handle, isLoading }: ShareBoardProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const boardUrl = handle ? `${window.location.origin}/${handle}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(boardUrl);
    toast({ title: t("common.copied") });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return <Skeleton className="h-48 w-full max-w-lg mx-auto" />;
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="font-mono">
          {t("home.shareBoard.title")}
        </CardTitle>
        <CardDescription className="font-sans">
          {handle
            ? t("home.shareBoard.description")
            : t("home.shareBoard.setupPrompt")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {handle ? (
          <div className="flex w-full items-center space-x-2">
            <Input value={boardUrl} readOnly className="font-mono" />
            <Button variant="outline" size="icon" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button asChild className="w-full font-mono">
            <Link to="/settings">
              <Settings className="mr-2 h-4 w-4" />
              {t("home.shareBoard.setupButton")}
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
