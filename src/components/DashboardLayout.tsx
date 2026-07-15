import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MobileBottomNav from "./MobileBottomNav";
import { Page } from "../types";
import { AnimatePresence } from "motion/react";
import { useDisplayMode } from "../context/DisplayModeContext";

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onAddChildRequest: () => void;
  onShowPathway?: (child: any) => void;
}

export default function DashboardLayout({
  children,
  currentPage,
  onPageChange,
  onAddChildRequest,
  onShowPathway,
}: DashboardLayoutProps) {
  const { isMvp } = useDisplayMode();
  const showSidebar = currentPage !== "style-guide" && !isMvp;

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-thread-off-white)] font-sans antialiased text-[var(--color-thread-darkest)]">
      {showSidebar && <Sidebar currentPage={currentPage} onPageChange={onPageChange} onShowPathway={onShowPathway} />}

      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          currentPage={currentPage}
          onAddChildRequest={onAddChildRequest}
          onPageChange={onPageChange}
        />

        <div
          className="thread-dashboard-scroll flex-1 overflow-y-auto scroll-smooth"
        >
          <AnimatePresence mode="wait">{children}</AnimatePresence>
        </div>
      </main>

      <MobileBottomNav currentPage={currentPage} onPageChange={onPageChange} />

    </div>
  );
}
