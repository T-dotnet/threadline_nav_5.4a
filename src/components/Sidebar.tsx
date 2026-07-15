import { useState } from "react";
import {
  Home,
  Info,
  ListTodo,
  LineChart,
  BookOpen,
  Lock,
  NotebookPen,
  Settings,
  ChevronLeft,
  ChevronRight,
  CalendarClock,
  ClipboardList,
} from "lucide-react";
import { Page } from "../types";
import { cn } from "../lib/utils";
import { motion } from "motion/react";
import { useCurrentChild } from "../context/ChildContext";

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onShowPathway?: (child: any) => void;
}

export default function Sidebar({ currentPage, onPageChange, onShowPathway }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { currentChild } = useCurrentChild();

  const assessedNavItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "assessment", label: "Assessment", icon: ClipboardList },
    { id: "understanding", label: "Understanding", icon: Info },
    { id: "priorities", label: "Priorities", icon: ListTodo },
    { id: "reviews", label: "Reviews", icon: LineChart },
    { id: "resources", label: "Resources", icon: BookOpen },
    { id: "documents", label: "Document Locker", icon: Lock },
    { id: "diary", label: "Diary", icon: NotebookPen },
  ];

  const newChildNavItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "assessment", label: "Assessment", icon: ClipboardList },
    { id: "understanding", label: "Understanding", icon: Info },
    { id: "priorities", label: "Priorities", icon: ListTodo },
    { id: "what-you-noticed", label: "Reviews", icon: LineChart },
    { id: "resources", label: "Resources", icon: BookOpen },
    { id: "documents", label: "Document Locker", icon: Lock },
    { id: "diary", label: "Diary", icon: NotebookPen },
  ];
  const navItems = (currentChild.isNew ? newChildNavItems : assessedNavItems).filter(item => {
    return !["resources", "documents", "diary"].includes(item.id);
  });

  const isGlobalPage = currentPage === "all-children" || currentPage === "questionnaire" || ["resources", "documents", "diary"].includes(currentPage);

  return (
    <motion.aside
      animate={{ width: ((isCollapsed) || isGlobalPage) ? 80 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex flex-shrink-0 flex-col border-r border-black/5 bg-[var(--color-thread-off-white)] p-6 max-md:hidden"
    >
      {!isGlobalPage && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-12 w-6 h-6 bg-white border border-black/10 rounded-full flex items-center justify-center text-[var(--color-thread-muted-text)] hover:text-slate-900 transition-all z-20 shadow-sm max-md:hidden"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      )}

      <button
        type="button"
        className="flex items-center px-2.5 pb-8 cursor-pointer group"
        onClick={() => onPageChange("all-children")}
        aria-label="Go to all children"
      >
        <div
          className={cn(
            "flex flex-col leading-none transition-opacity duration-200 grow min-w-0 overflow-hidden",
            ((isCollapsed) || isGlobalPage)
              ? "opacity-0 invisible w-0"
              : "opacity-100 visible w-auto",
          )}
        >
          <img
            src="/threadline-logo-colored.svg"
            alt="Threadline"
            className="h-auto w-[150px]"
          />
        </div>
      </button>

      {!isGlobalPage && (
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPageChange(item.id as Page)}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3.5 px-3 py-3 rounded-xl text-[var(--color-thread-muted-green)] font-medium text-[0.92rem] transition-all cursor-pointer hover:bg-black/5 hover:text-[var(--color-thread-dark-slate)] relative group/nav min-h-[44px]",
                currentPage === item.id &&
                  "bg-[var(--color-thread-light-green)] text-[var(--color-thread-dark-slate)] font-medium",
              )}
            >
              <item.icon className="w-[19px] h-[19px] stroke-[1.8] flex-shrink-0" />
              <span
                className={cn(
                  "max-md:hidden transition-opacity duration-200 whitespace-nowrap overflow-hidden",
                  isCollapsed
                    ? "opacity-0 invisible w-0"
                    : "opacity-100 visible w-auto",
                )}
              >
                {item.label}
              </span>
            </motion.button>
          ))}
          <div className="border-t border-black/5 my-2.5" />
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onShowPathway?.(currentChild)}
            title={isCollapsed ? "Clinical Path" : undefined}
            className="relative flex min-h-[44px] cursor-pointer items-center gap-3.5 rounded-xl px-3 py-3 text-[0.92rem] font-medium text-[var(--color-thread-muted-green)] transition-all hover:bg-black/5 hover:text-[var(--color-thread-dark-slate)] group/nav"
          >
            <CalendarClock className="w-[19px] h-[19px] stroke-[1.8] flex-shrink-0" />
            <span
              className={cn(
                "max-md:hidden transition-opacity duration-200 whitespace-nowrap overflow-hidden",
                isCollapsed
                  ? "opacity-0 invisible w-0"
                  : "opacity-100 visible w-auto",
              )}
            >
              Clinical Path
            </span>
          </motion.button>
        </nav>
      )}

      <div className="flex-1" />

      {!isGlobalPage && (
        <div className="border-t border-black/5 pt-2.5">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onPageChange("settings")}
            title={isCollapsed ? "Settings" : undefined}
            className={cn(
              "flex items-center gap-3.5 px-3 py-3 rounded-lg text-[var(--color-thread-muted-green)] font-medium text-[0.92rem] transition-all cursor-pointer hover:bg-black/5 hover:text-[var(--color-thread-dark-slate)] w-full min-h-[44px]",
              currentPage === "settings" &&
                "bg-[var(--color-thread-light-green)] text-[var(--color-thread-dark-slate)] font-medium",
            )}
          >
            <Settings className="w-[19px] h-[19px] stroke-[1.8] flex-shrink-0" />
            <span
              className={cn(
                "max-md:hidden transition-opacity duration-200 whitespace-nowrap overflow-hidden",
                isCollapsed
                  ? "opacity-0 invisible w-0"
                  : "opacity-100 visible w-auto",
              )}
            >
              Settings
            </span>
          </motion.button>
        </div>
      )}
    </motion.aside>
  );
}
