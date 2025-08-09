// frontend/src/components/shared/LanguageSwitch.tsx
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

export function LanguageSwitch() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === "zh" ? "en" : "zh";
    i18n.changeLanguage(nextLang);
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleLanguage}>
      <Languages className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Toggle Language</span>
    </Button>
  );
}
