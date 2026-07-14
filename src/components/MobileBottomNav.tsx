import { BookOpen, Home, Lock } from "lucide-react";
import type { Page } from "../types";
import { cn } from "../lib/utils";
import { useDisplayMode } from "../context/DisplayModeContext";

interface MobileBottomNavProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export default function MobileBottomNav({
  currentPage,
  onPageChange,
}: MobileBottomNavProps) {
  const { isMvp } = useDisplayMode();
  const homePage: Page = isMvp ? "assessment" : "home";

  const items: Array<{
    id: "resources" | "home" | "documents";
    label: string;
    page: Page;
    icon: typeof Home;
    isActive: boolean;
  }> = [
    {
      id: "resources",
      label: "Resources",
      page: "resources",
      icon: BookOpen,
      isActive: currentPage === "resources",
    },
    {
      id: "home",
      label: "Home",
      page: homePage,
      icon: Home,
      isActive: currentPage === homePage,
    },
    {
      id: "documents",
      label: "Doc Locker",
      page: "documents",
      icon: Lock,
      isActive: currentPage === "documents",
    },
  ];

  return (
    <nav className="thread-mobile-bottom-nav md:hidden" aria-label="Primary navigation">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-current={item.isActive ? "page" : undefined}
          onClick={() => onPageChange(item.page)}
          className={cn(
            "thread-mobile-bottom-nav__item",
            item.isActive && "thread-mobile-bottom-nav__item--active",
          )}
        >
          <span className="thread-mobile-bottom-nav__icon-wrap" aria-hidden="true">
            <item.icon className="thread-mobile-bottom-nav__icon" />
          </span>
          <span className="thread-mobile-bottom-nav__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
