import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./ThemeProvider"; // 新增导入

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const domain = import.meta.env.VITE_CLERK_FRONTEND_API;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

const queryClient = new QueryClient();

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="momo-theme">
        <ClerkProvider
          publishableKey={clerkPubKey}
          domain={domain}
          signInFallbackRedirectUrl={"/auth-callback"}
          signUpFallbackRedirectUrl={"/auth-callback"}
        >
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster />
          </QueryClientProvider>
        </ClerkProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
