import {
  SignInButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Menu, MessageSquareQuote } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggleButton } from "@/components/shared/ThemeToggleButton";
import { LanguageSwitch } from "@/components/shared/LanguageSwitch";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-card border-b border-border sticky top-0 z-30">
      <div className="flex items-center gap-2 md:gap-4">
        {/* Hamburger Menu for mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open Menu</span>
        </Button>
        <Link to="/" className="flex items-center">
          <MessageSquareQuote className="h-6 w-6 text-primary" />
          <span className="ml-2 font-mono text-xl font-bold text-foreground">
            momo
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <ThemeToggleButton />
        <LanguageSwitch />
        <SignedOut>
          <SignInButton mode="modal" fallbackRedirectUrl="/auth-callback">
            <Button
              variant="outline"
              className="font-mono text-xs sm:text-sm ml-1 sm:ml-2"
            >
              {t("nav.signIn")}
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-9 w-9",
              },
            }}
          />
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
