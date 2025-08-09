// frontend/src/App.tsx
import { Routes, Route } from "react-router-dom";
import { SignedIn } from "@clerk/clerk-react";

import RootLayout from "@/components/layout/RootLayout";
import HomePage from "@/pages/HomePage";
import ProfilePage from "@/pages/ProfilePage";
import QuestionPage from "@/pages/QuestionPage"; // 新增导入
import BottlesPage from "@/pages/BottlesPage";
import BottleChatPage from "@/pages/BottleChatPage";
import SettingsPage from "@/pages/SettingsPage";
import AuthCallbackPage from "@/pages/AuthCallbackPage";
import InboxPage from "@/pages/InboxPage";

function App() {
  return (
    <Routes>
      <Route path="/auth-callback" element={<AuthCallbackPage />} />

      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/:handle" element={<ProfilePage />} />
        <Route path="/q/:questionId" element={<QuestionPage />} />{" "}
        {/* 新增路由 */}
        {/* Protected Routes */}
        <Route
          path="/inbox"
          element={
            <SignedIn>
              <InboxPage />
            </SignedIn>
          }
        />
        <Route
          path="/bottles"
          element={
            <SignedIn>
              <BottlesPage />
            </SignedIn>
          }
        />
        <Route
          path="/bottles/:id"
          element={
            <SignedIn>
              <BottleChatPage />
            </SignedIn>
          }
        />
        <Route
          path="/settings"
          element={
            <SignedIn>
              <SettingsPage />
            </SignedIn>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
