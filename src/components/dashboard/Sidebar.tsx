import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  History,
  Settings,
  HelpCircle,
  Shield,
  Activity,
  Image,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
  active?: boolean;
  badge?: string;
}

const mainNav: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", active: true },
  { icon: Image, label: "Analyze", href: "/analyze" },
  { icon: History, label: "History", href: "/history", badge: "23" },
  { icon: Activity, label: "Activity", href: "/activity" },
  { icon: FileText, label: "Reports", href: "/reports" },
];

const secondaryNav: NavItem[] = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help", href: "/help" },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border/50 bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-lg font-bold">LensLine</span>
          </div>
        )}
        {collapsed && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 shrink-0", collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <p
          className={cn(
            "mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-opacity",
            collapsed && "opacity-0"
          )}
        >
          Main
        </p>
        {mainNav.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              item.active
                ? "bg-sidebar-accent text-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            )}
          >
            <item.icon
              className={cn(
                "h-5 w-5 shrink-0 transition-colors",
                item.active && "text-primary"
              )}
            />
            {!collapsed && (
              <>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 px-1.5 text-xs font-semibold text-primary">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </a>
        ))}

        <div className="my-4 border-t border-border/50" />

        <p
          className={cn(
            "mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-opacity",
            collapsed && "opacity-0"
          )}
        >
          Support
        </p>
        {secondaryNav.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              item.active
                ? "bg-sidebar-accent text-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </a>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-border/50 p-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium text-foreground">
              Extension Active
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Right-click any image to analyze
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              <span className="text-xs text-accent">Connected</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
