import { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronDown,
  Bell,
  Plus,
  Settings,
  LogOut,
  Users,
  Menu,
  X,
  Home,
  Info,
  ListTodo,
  LineChart,
  BookOpen,
  Lock,
  NotebookPen,
  Palette,
  ClipboardList,
  Layers,
} from "lucide-react";
import { Child, Page } from "../types";
import { Avatar } from "./ui/Avatar";
import { IconButton } from "./ui/IconButton";
import { FullScreenSurface } from "./ui/FullScreenSurface";
import { ModalCloseButton, ModalShell } from "./ui/ModalShell";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { isNewChildAllowedPage } from "../navigation";
import { getChildSessionStatus, getChildSubheading } from "../lib/childStatus";
import { DEMO_WORKSPACE_EMAIL } from "../lib/demoWorkspace";
import { SHOW_WORKSPACE_TOOLS } from "../lib/workspaceTools";

import { useCurrentChild } from "../context/ChildContext";
import { Switch } from "./ui/Switch";
import { FilterTab } from "./ui/FilterTab";
import { Badge } from "./ui/Badge";
import { useDisplayMode } from "../context/DisplayModeContext";

interface TopBarProps {
  currentPage?: Page;
  onAddChildRequest: () => void;
  onPageChange: (page: Page) => void;
}

type UpdateStatus = "new" | "unread" | "read";
type UpdateFilter = "all" | UpdateStatus;

const ASSESSMENT_MODAL_REQUEST_KEYS = [
  "threadline-open-clinical-modules-request",
  "threadline-open-clinician-share-request",
];

function clearAssessmentModalOpenRequests() {
  try {
    ASSESSMENT_MODAL_REQUEST_KEYS.forEach((key) => sessionStorage.removeItem(key));
  } catch {
    // Nothing to clear when session storage is unavailable.
  }

  const currentUrl = new URL(window.location.href);
  if (currentUrl.searchParams.has("openClinicalModules") || currentUrl.searchParams.has("openClinicianShare")) {
    currentUrl.searchParams.delete("openClinicalModules");
    currentUrl.searchParams.delete("openClinicianShare");
    currentUrl.searchParams.delete("childId");
    currentUrl.searchParams.delete("childName");
    window.history.replaceState(null, "", `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
  }
}

export default function TopBar({
  currentPage,
  onAddChildRequest,
  onPageChange,
}: TopBarProps) {
  const { currentChild, childrenList, setChild } = useCurrentChild();
  const { isMvp, setIsMvp } = useDisplayMode();

  useEffect(() => {
    if (isMvp && currentPage === "home") {
      onPageChange("assessment");
    }
  }, [isMvp, currentPage, onPageChange]);

  const isAllChildrenView = currentPage === "all-children" || ["resources", "documents", "diary"].includes(currentPage as Page);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDisplayControlsOpen, setIsDisplayControlsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [updateFilter, setUpdateFilter] = useState<UpdateFilter>("all");
  const [readUpdateIds, setReadUpdateIds] = useState<Record<string, boolean>>({});

  const dropdownRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  const handleChildSwitch = useCallback((child: Child) => {
    clearAssessmentModalOpenRequests();
    setChild(child);
    const targetPage = isMvp ? "assessment" : "home";
    if (currentPage === "all-children") {
      onPageChange(targetPage);
    } else if (child.isNew && !isNewChildAllowedPage(currentPage)) {
      onPageChange(targetPage);
    } else if (!child.isNew && (currentPage === "preview" || currentPage === "what-you-noticed")) {
      onPageChange(targetPage);
    } else if (isMvp && currentPage === "home") {
      onPageChange("assessment");
    }
    setIsDropdownOpen(false);
  }, [setChild, currentPage, onPageChange, isMvp]);

  const handleAllChildrenSelect = useCallback(() => {
    onPageChange("all-children");
    setIsDropdownOpen(false);
  }, [onPageChange]);

  const allChildrenUpdates = childrenList
    .map((child, index) => {
    const updateId = child.id || `${child.name}-${index}`;
    const sessionStatus = getChildSessionStatus(child);
    const sessionBooked = sessionStatus === "booked";
    const sessionCancelled = sessionStatus === "cancelled";
    const status: UpdateStatus = readUpdateIds[updateId]
      ? "read"
      : child.isNew && !sessionBooked
      ? "new"
      : "unread";
    const title = child.isNew ? "Intake update" : "Live progress";
    const summary = child.isNew
      ? sessionBooked
        ? "First session booked. Keep reports and setup details ready for review."
        : sessionCancelled
        ? "The first session was cancelled. Book a new time when you are ready."
        : "Intake is still in progress. Finish the questionnaire and book the first session."
      : `Latest view available in ${child.name}'s dashboard. Open it to review current progress and next steps.`;
    const linkLabel = child.isNew ? `Open ${child.name} Insight` : `Open ${child.name}`;

    return {
      child,
      linkLabel,
      status,
      summary,
      title,
      updateId,
    };
  });
  const visibleAllChildrenUpdates = allChildrenUpdates.filter((update) => updateFilter === "all" || update.status === updateFilter);
  const updateCounts = allChildrenUpdates.reduce(
    (counts, update) => ({
      ...counts,
      all: counts.all + 1,
      [update.status]: counts[update.status] + 1,
    }),
    { all: 0, new: 0, unread: 0, read: 0 }
  );
  const updateFilterOptions: Array<{ label: string; value: UpdateFilter }> = [
    { label: "All", value: "all" },
    { label: "Unread", value: "unread" },
    { label: "New", value: "new" },
    { label: "Read", value: "read" },
  ];
  const updateStatusLabels: Record<UpdateStatus, string> = {
    new: "New",
    unread: "Unread",
    read: "Read",
  };

  const updateStatusBadgeVariants: Record<UpdateStatus, "now" | "future" | "clinical"> = {
    new: "now",
    unread: "future",
    read: "clinical",
  };
  const updateStatusBadgeClasses: Record<UpdateStatus, string> = {
    new: "px-2.5 py-1 text-xs",
    unread: "px-2.5 py-1 text-xs",
    read: "border-black/5 bg-[var(--color-thread-off-white)] px-2.5 py-1 text-xs text-[var(--color-thread-gray)]",
  };
  const handleOpenUpdate = useCallback((child: Child, updateId: string) => {
    setReadUpdateIds((prev) => ({ ...prev, [updateId]: true }));
    handleChildSwitch(child);
    setIsAlertsOpen(false);
  }, [handleChildSwitch]);

  const handleMarkUpdateRead = useCallback((updateId: string) => {
    setReadUpdateIds((prev) => ({ ...prev, [updateId]: true }));
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setReadUpdateIds((prev) => {
      const next = { ...prev };
      allChildrenUpdates.forEach((update) => {
        next[update.updateId] = true;
      });
      return next;
    });
    setUpdateFilter("read");
  }, [allChildrenUpdates]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        alertsRef.current &&
        !alertsRef.current.contains(event.target as Node)
      ) {
        setIsAlertsOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setIsDropdownOpen(false);
      setIsAlertsOpen(false);
      setIsMobileMenuOpen(false);
      if (profileRef.current?.contains(document.activeElement)) {
        setIsProfileMenuOpen(false);
        profileButtonRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className={cn(
      "flex items-center justify-between px-11 py-4.5 border-b border-black/5 bg-[var(--color-thread-off-white)] sticky top-0 z-10 max-md:px-5",
      isMvp && "border-b-0 px-6 sm:px-8 md:px-12 max-w-5xl mx-auto w-full max-[420px]:px-3"
    )}>
      <div className="flex min-w-0 items-center gap-3 max-sm:gap-0">
        {/* Burger Menu Button (Visible on Mobile only) */}
        {!isMvp && (
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden flex items-center justify-center w-11 h-11 bg-white border border-black/5 rounded-full shadow-xs hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 stroke-[2]" />
          </button>
        )}

        {isMvp && (
          <button
            type="button"
            className="group mr-2 hidden min-h-11 cursor-pointer items-center px-1.5 py-2 md:flex"
            onClick={() => onPageChange("all-children")}
            aria-label="Go to all children"
          >
            <img
              src="/threadline-logo-colored.svg"
              alt="Threadline"
              className="h-auto w-[142px] max-sm:w-[120px] max-[420px]:!w-[76px]"
            />
          </button>
        )}

        <div className="relative min-w-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label={`Switch child profile. Current selection: ${isAllChildrenView ? "All Children" : currentChild.name}`}
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
            className={cn(
              "flex items-center gap-3 rounded-full bg-white p-1.5 pr-2.5 font-sans shadow-sm transition-all hover:shadow-md max-sm:gap-0.5 max-sm:p-1 max-sm:pr-1",
              isMvp && "max-sm:min-h-11 max-sm:min-w-14 max-sm:justify-center",
            )}
          >
          {isAllChildrenView ? (
            <>
              <Avatar
                size="sm"
                className="bg-[var(--color-thread-mid-green)] text-white"
                fallback={<Users className="w-3.5 h-3.5 stroke-[2.2]" />}
              />
              <div className="flex flex-col text-left leading-none max-sm:hidden">
                <span className="font-medium text-sm text-slate-900">
                  All Children
                </span>
                <span className="text-xs text-[var(--color-thread-muted-text)] mt-0.5">
                  Family synthesis
                </span>
              </div>
            </>
          ) : (
            <>
              <Avatar
                size="sm"
                fallback={currentChild.initial}
                className="bg-[var(--color-thread-mid-green)] text-white font-serif"
              />
              <div className="flex flex-col text-left leading-none max-sm:hidden">
                <span className="font-medium text-sm text-slate-900">
                  {currentChild.name}
                </span>
                {!isMvp && (
                  <span className="text-xs text-[var(--color-thread-muted-text)] mt-0.5">
                    {getChildSubheading(currentChild)}
                  </span>
                )}
              </div>
            </>
          )}
          <ChevronDown
            className={cn(
              "ml-1 h-[15px] w-[15px] text-[var(--color-thread-muted-text)] transition-transform duration-200 max-sm:ml-0 max-sm:h-3.5 max-sm:w-3.5",
              isDropdownOpen && "rotate-180",
            )}
          />
          </button>

          <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-0 top-14 z-50 w-60 rounded-2xl border border-black/5 bg-white py-2 font-sans shadow-dropdown max-sm:fixed max-sm:left-3 max-sm:right-3 max-sm:top-20 max-sm:w-auto"
            >
              <div className="px-4 py-2.5">
                <span className="text-xs tracking-[0.16em] uppercase text-[var(--color-thread-muted-text)] font-medium">
                  Select Child Profile
                </span>
              </div>

              <div className="flex flex-col">
                <button
                  onClick={handleAllChildrenSelect}
                  className={cn(
                    "flex items-center gap-3.5 px-4 py-4 w-full text-left transition-all border-b border-black/5 group/all min-h-[44px]",
                    currentPage === "all-children"
                      ? "bg-slate-50"
                      : "hover:bg-slate-50"
                  )}
                  id="all-children-dropdown-option"
                >
                  <Avatar
                    size="md"
                    className={cn(
                      currentPage === "all-children"
                        ? "bg-[var(--color-thread-mid-green)] text-white"
                        : "bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] group-hover/all:bg-[var(--color-thread-mid-green)] group-hover/all:text-white"
                    )}
                    fallback={<Users className="w-4 h-4 stroke-[2]" />}
                  />
                  <div className="flex flex-col leading-none">
                    <span className={cn(
                      "text-sm tracking-tight font-medium",
                      currentPage === "all-children"
                        ? "text-[var(--color-thread-mid-green)]"
                        : "text-[var(--color-thread-heading)]"
                    )}>
                      All Children Overview
                    </span>
                    {!isMvp && (
                      <span className="text-xs text-[var(--color-thread-muted-text)] mt-1">
                        Family synthesis & schemes
                      </span>
                    )}
                  </div>
                </button>

                {childrenList.map((child, idx) => {
                  const isSelected = (currentChild.id && child.id ? currentChild.id === child.id : currentChild.name === child.name) && currentPage !== "all-children";

                  return (
                    <div
                      key={child.id || `${child.name}-${idx}`}
                      className={cn(
                        "flex items-center gap-3.5 px-4 py-3.5 w-full transition-colors min-h-[44px]",
                        isSelected ? "bg-slate-50" : "hover:bg-slate-50",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => handleChildSwitch(child)}
                        className="flex min-w-0 flex-1 items-center gap-3.5 text-left"
                      >
                        <Avatar
                          size="md"
                          className="bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] font-serif"
                          fallback={child.initial}
                        />
                        <div className="flex min-w-0 flex-col leading-none">
                          <span
                            className={cn(
                              "truncate text-sm tracking-tight",
                              isSelected
                                ? "font-medium text-slate-900"
                                : "font-medium text-slate-700",
                            )}
                          >
                            {child.name}
                          </span>
                          {!isMvp && (
                            <span className="text-xs text-[var(--color-thread-muted-text)] mt-0.5">
                              {getChildSubheading(child)}
                            </span>
                          )}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-black/5 mt-2 pt-2 px-2">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onAddChildRequest();
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 w-full text-left hover:bg-slate-50 rounded-xl transition-colors group"
                >
                  <div className="w-[28px] h-[28px] rounded-full border border-black/10 flex items-center justify-center text-[var(--color-thread-muted-text)] group-hover:text-slate-600 transition-colors">
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                    Add child profile
                  </span>
                </button>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex gap-2.5 items-center max-[420px]:gap-1">
        <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="mr-1 flex items-center gap-1.5 max-md:hidden"
            >
              <IconButton
                onClick={() => onPageChange("resources")}
                title="Resources"
                aria-label="Open resources"
                className={cn(
                  isMvp ? "max-[420px]:h-11 max-[420px]:w-11" : "max-[420px]:h-9 max-[420px]:w-9",
                  currentPage === "resources"
                    ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white shadow-sm"
                    : ""
                )}
              >
                <BookOpen className="w-[19px] h-[19px] stroke-[1.8]" />
              </IconButton>
              <IconButton
                onClick={() => onPageChange("documents")}
                title="Documents"
                aria-label="Open documents"
                className={cn(
                  isMvp ? "max-[420px]:h-11 max-[420px]:w-11" : "max-[420px]:h-9 max-[420px]:w-9",
                  currentPage === "documents"
                    ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white shadow-sm"
                    : ""
                )}
              >
                <Lock className="w-[19px] h-[19px] stroke-[1.8]" />
              </IconButton>
              {!isMvp && (
                <IconButton
                  onClick={() => onPageChange("diary")}
                  title="Diary"
                  className={cn(
                    currentPage === "diary"
                      ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white shadow-sm"
                      : ""
                  )}
                >
                  <NotebookPen className="w-[19px] h-[19px] stroke-[1.8]" />
                </IconButton>
              )}
        </motion.div>

        <div className="relative" ref={alertsRef}>
          <IconButton
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            hasBadge
            aria-label="Open live updates"
            aria-haspopup="true"
            aria-expanded={isAlertsOpen}
            className={cn(
              isMvp ? "max-[420px]:h-11 max-[420px]:w-11" : "max-[420px]:h-9 max-[420px]:w-9",
            )}
          >
            <Bell className="w-[19px] h-[19px] stroke-[1.8]" />
          </IconButton>

          <AnimatePresence>
            {isAlertsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="fixed sm:absolute top-20 sm:top-14 left-4 right-4 sm:left-auto sm:right-0 w-auto sm:w-[380px] bg-white rounded-[24px] border border-black/5 shadow-modal py-6 z-50 font-sans"
              >
                <div className="px-6 mb-5">
                  <span className="text-xs tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] font-medium mb-1.5 block">
                    Live updates
                  </span>
                  <h2 className="text-[1.05rem] font-medium text-[var(--color-thread-dark-slate)] tracking-tight leading-none">
                    Family Updates
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {updateFilterOptions.map((option) => (
                      <FilterTab
                        key={option.value}
                        active={updateFilter === option.value}
                        label={`${option.label} ${updateCounts[option.value]}`}
                        onClick={() => setUpdateFilter(option.value)}
                        className="min-h-9 px-3 py-1.5 text-xs"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3.5 px-6 mb-6 max-h-[340px] overflow-y-auto">
                  {visibleAllChildrenUpdates.length > 0 ? visibleAllChildrenUpdates.map((update) => {
                    const { child, linkLabel, status, summary, title, updateId } = update;

                    return (
                      <div key={updateId} className="relative rounded-none rounded-tr-[18px] bg-[var(--color-thread-off-white)] px-5 py-4 transition-colors hover:bg-[var(--color-thread-light-green)]/55 group">
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-xs uppercase tracking-[0.12em] text-[var(--color-thread-muted-text)] font-medium">
                                {child.name}
                              </div>
                              <h3 className={cn(
                                "mt-1.5 font-medium text-[var(--color-thread-dark-slate)] text-base leading-tight tracking-tight transition-colors",
                                child.isNew ? "group-hover:text-amber-600" : "group-hover:text-[var(--color-thread-mid-green)]"
                              )}>
                                {title}
                              </h3>
                            </div>
                            <Badge
                              variant={updateStatusBadgeVariants[status]}
                              className={cn("shrink-0 tracking-[0.08em]", updateStatusBadgeClasses[status])}
                            >
                              {updateStatusLabels[status]}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {summary}
                          </p>
                          <div className="flex items-center justify-between gap-3 pt-1">
                            <button
                              type="button"
                              onClick={() => handleOpenUpdate(child, updateId)}
                              className="text-sm font-medium text-[var(--color-thread-mid-green)] hover:opacity-75 transition-opacity"
                            >
                              {linkLabel}
                            </button>
                            {status !== "read" && (
                              <button
                                type="button"
                                onClick={() => handleMarkUpdateRead(updateId)}
                                className="ml-auto text-xs font-medium text-[var(--color-thread-muted-text)] hover:text-slate-700 transition-colors"
                              >
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="rounded-2xl bg-slate-50 px-5 py-4 text-sm leading-relaxed text-[var(--color-thread-muted-text)]">
                      No {updateFilter === "all" ? "" : updateFilter} updates to show.
                    </div>
                  )}
                </div>

                <div className="border-t border-black/5 px-6 pt-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleMarkAllRead}
                      className="text-sm font-medium text-[var(--color-thread-gray)] hover:text-[var(--color-thread-dark-slate)] transition-colors"
                    >
                      Mark all read
                    </button>
                  </div>
                  <button className="text-sm font-medium text-[var(--color-thread-gray)] hover:text-[var(--color-thread-mid-green)] transition-colors">
                    Refresh updates
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={profileRef}>
          <button
            ref={profileButtonRef}
            type="button"
            aria-label="Open account menu"
            aria-haspopup="true"
            aria-expanded={isProfileMenuOpen}
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={cn(
              "flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-thread-mid-green)]/35 focus-visible:ring-offset-2",
              isMvp && "max-[420px]:h-11 max-[420px]:w-11",
            )}
          >
            <Avatar
              size="lg"
              className="font-serif bg-[var(--color-thread-mid-green)] text-white shadow-sm transition-opacity hover:opacity-90 max-[420px]:h-9 max-[420px]:w-9"
              fallback="S"
            />
          </button>

          <AnimatePresence>
            {isProfileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="thread-z-dropdown absolute right-0 top-14 w-80 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-black/5 bg-white py-2.5 font-sans shadow-dropdown"
              >
                <div className="px-4.5 py-2 mb-1.5 border-b border-black/5">
                  <span className="text-xs tracking-[0.12em] uppercase text-[var(--color-thread-muted-text)] font-medium block mb-0.5">
                    Clinical Workspace
                  </span>
                  <span className="text-sm font-medium text-slate-700 block truncate">
                    {DEMO_WORKSPACE_EMAIL}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5 px-1.5">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onPageChange("settings");
                    }}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-left hover:bg-slate-50 transition-colors group min-h-[44px]"
                  >
                    <Settings className="w-[18px] h-[18px] text-[var(--color-thread-muted-text)] group-hover:text-slate-600 transition-colors" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                      App Settings
                    </span>
                  </button>

                  {SHOW_WORKSPACE_TOOLS && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setIsDisplayControlsOpen(true);
                      }}
                      className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-slate-50 group"
                    >
                      <Palette className="h-[18px] w-[18px] text-[var(--color-thread-muted-text)] transition-colors group-hover:text-[var(--color-thread-mid-green)]" />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                        Workspace Mode
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onPageChange("settings");
                      setTimeout(() => {
                        const target = document.getElementById("notification-settings-section");
                        if (target) {
                          target.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                      }, 120);
                    }}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-left hover:bg-slate-50 transition-colors group min-h-[44px]"
                  >
                    <Bell className="w-[18px] h-[18px] text-[var(--color-thread-muted-text)] group-hover:text-amber-500 transition-colors" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                      Notification Settings
                    </span>
                  </button>

                  <div className="border-t border-black/5 my-1" />

                  <button 
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-left hover:bg-red-50 transition-colors group min-h-[44px]"
                  >
                    <LogOut className="w-[18px] h-[18px] text-[var(--color-thread-muted-text)] group-hover:text-red-500 transition-colors" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-red-600">
                      Log out
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {SHOW_WORKSPACE_TOOLS && (
          <ModalShell
            isOpen={isDisplayControlsOpen}
            onRequestClose={() => setIsDisplayControlsOpen(false)}
            titleId="display-controls-title"
            size="small"
            panelClassName="max-h-[86vh] overflow-y-auto"
            zIndexClassName="thread-z-fullscreen"
          >
          <div className="p-6 sm:p-7 font-sans">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <span className="text-xs tracking-[0.14em] uppercase text-[var(--color-thread-mid-green)] font-medium">
                  Internal workspace
                </span>
                <h2 id="display-controls-title" className="mt-2 text-[1.55rem] font-medium leading-tight tracking-tight text-[var(--color-thread-heading)]">
                  Workspace Mode
                </h2>
              </div>
              <ModalCloseButton
                label="Close workspace mode"
                onClick={() => setIsDisplayControlsOpen(false)}
              />
            </div>

            <div className="space-y-1.5">
              {SHOW_WORKSPACE_TOOLS && (
                <button
                  onClick={() => {
                    setIsDisplayControlsOpen(false);
                    onPageChange("style-guide");
                  }}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-left hover:bg-slate-50 transition-colors group min-h-[44px]"
                >
                  <Palette className="w-[18px] h-[18px] text-[var(--color-thread-muted-text)] group-hover:text-[var(--color-thread-mid-green)] transition-colors" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                    Design System
                  </span>
                </button>
              )}

              <div className="flex items-center justify-between px-3 py-2.5 rounded-xl w-full hover:bg-slate-50 transition-colors min-h-[44px]">
                <div className="flex items-center gap-3">
                  <Layers className="w-[18px] h-[18px] text-[var(--color-thread-muted-text)]" />
                  <span className="text-sm font-medium text-slate-700">
                    MVP Mode
                  </span>
                </div>
                <Switch
                  aria-label="MVP Mode"
                  checked={isMvp}
                  onCheckedChange={(checked) => setIsMvp(checked)}
                />
              </div>

            </div>
          </div>
          </ModalShell>
        )}

      </div>

      {/* Full-Page Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <FullScreenSurface
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            tone="white"
            zIndexClassName="thread-z-fullscreen"
            className="p-6"
          >
            {/* Header with App Logo and Close Button */}
            <div className="flex items-center justify-between pb-6 border-b border-black/5 mb-8">
              <img
                src="/threadline-logo-colored.svg"
                alt="Threadline"
                className="h-auto w-[150px]"
              />

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile context snippet */}
            <div className="bg-slate-50 rounded-2xl p-4.5 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  size="md"
                  fallback={isAllChildrenView ? <Users className="w-4 h-4 stroke-[2]" /> : currentChild.initial}
                  className="bg-[var(--color-thread-mid-green)] text-white font-serif"
                />
                <div className="flex flex-col text-left leading-none">
                  <span className="font-medium text-base text-slate-900">
                    {isAllChildrenView ? "All Children" : currentChild.name}
                  </span>
                  {!isMvp && (
                    <span className="text-xs text-[var(--color-thread-muted-text)] mt-1">
                      {isAllChildrenView ? "Family Synthesis" : getChildSubheading(currentChild)}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setIsDropdownOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="text-xs font-medium text-[var(--color-thread-mid-green)] bg-white border border-black/5 py-1.5 px-3 rounded-lg shadow-xs cursor-pointer hover:bg-slate-50"
              >
                Switch Profile
              </button>
            </div>

            {/* Navigation links */}
            <div className="flex flex-col gap-2.5 flex-1">
              <span className="text-xs tracking-[0.16em] uppercase text-[var(--color-thread-muted-text)] font-medium mb-1.5 px-3">
                Navigation Menu
              </span>
              {(() => {
                const items = currentChild.isNew
                  ? [
                      { id: "home", label: "Home", icon: Home },
                      { id: "assessment", label: "Assessment", icon: ClipboardList },
                      { id: "understanding", label: "Understanding", icon: Info },
                      { id: "priorities", label: "Priorities", icon: ListTodo },
                      { id: "what-you-noticed", label: "Reviews", icon: LineChart },
                      { id: "resources", label: "Resources", icon: BookOpen },
                      { id: "documents", label: "Document Locker", icon: Lock },
                      { id: "diary", label: "Diary", icon: NotebookPen },
                      { id: "settings", label: "App Settings", icon: Settings },
                    ]
                  : [
                      { id: "home", label: "Home", icon: Home },
                      { id: "assessment", label: "Assessment", icon: ClipboardList },
                      { id: "understanding", label: "Understanding", icon: Info },
                      { id: "priorities", label: "Priorities", icon: ListTodo },
                      { id: "reviews", label: "Reviews", icon: LineChart },
                      { id: "resources", label: "Resources", icon: BookOpen },
                      { id: "documents", label: "Document Locker", icon: Lock },
                      { id: "diary", label: "Diary", icon: NotebookPen },
                      { id: "settings", label: "App Settings", icon: Settings },
                    ];
                return items.filter(item => {
                  if (["resources", "documents", "diary"].includes(item.id)) {
                    return false;
                  }
                  if (isMvp && ["home", "understanding", "priorities", "reviews", "what-you-noticed", "diary"].includes(item.id)) {
                    return false;
                  }
                  if (isMvp && (item.id === "assessment" || item.id === "settings")) {
                    return false;
                  }
                  return true;
                });
              })().map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-4 px-4 py-4 rounded-xl text-[1rem] font-medium transition-all text-left cursor-pointer min-h-[48px]",
                      isActive
                        ? "bg-[var(--color-thread-light-green)] text-[var(--color-thread-dark-slate)] font-medium shadow-xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 stroke-[2]",
                      isActive ? "text-[var(--color-thread-mid-green)]" : "text-[var(--color-thread-muted-text)]"
                    )} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Footer Workspace Info */}
            <div className="mt-12 pt-6 border-t border-black/5 text-center flex flex-col items-center gap-1.5">
              <span className="text-xs text-[var(--color-thread-muted-text)]">Clinical Workspace</span>
              <span className="text-sm font-medium text-slate-600">{DEMO_WORKSPACE_EMAIL}</span>
            </div>
          </FullScreenSurface>
        )}
      </AnimatePresence>
    </header>
  );
}
