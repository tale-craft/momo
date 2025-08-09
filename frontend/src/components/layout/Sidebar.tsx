// frontend/src/components/layout/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/api/authApi";
import {
  Home,
  Package,
  Settings,
  MessageSquareQuote,
  Inbox,
  User, // 新增图标
} from "lucide-react";
import { cn } from "@/lib/shadcn-utils";

const allNavItems = [
  { href: "/", labelKey: "nav.home", icon: Home, protected: false },
  { href: "/inbox", labelKey: "nav.inbox", icon: Inbox, protected: true },
  { href: "/bottles", labelKey: "nav.bottles", icon: Package, protected: true },
  // "我的留言板" 将被动态添加
  {
    href: "/settings",
    labelKey: "nav.settings",
    icon: Settings,
    protected: true,
  },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isSidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { t } = useTranslation();
  const { isSignedIn, getToken } = useAuth();

  const { data: myProfile } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!isSignedIn) return null;
      const token = await getToken();
      return token ? getMyProfile(token) : null;
    },
    enabled: isSignedIn,
  });

  const userHandle = myProfile?.user?.handle;

  let navItems = allNavItems.filter((item) => !item.protected || isSignedIn);

  if (isSignedIn && userHandle) {
    const bottlesIndex = navItems.findIndex((item) => item.href === "/bottles");
    if (bottlesIndex !== -1) {
      navItems.splice(bottlesIndex + 1, 0, {
        href: `/${userHandle}`,
        labelKey: "nav.myBoard",
        icon: User,
        protected: true,
      });
    }
  }

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 z-40 md:hidden",
          isSidebarOpen ? "block" : "hidden"
        )}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full flex-col w-64 border-r border-border bg-card z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center h-16 px-6 border-b border-border">
          <MessageSquareQuote className="h-6 w-6 text-primary" />
          <span className="ml-2 font-mono text-xl font-bold text-foreground">
            momo
          </span>
        </div>
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.labelKey}>
                <NavLink
                  to={item.href}
                  end={item.href === "/"}
                  onClick={() => setSidebarOpen(false)} // Close sidebar on nav
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )
                  }
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{t(item.labelKey)}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
