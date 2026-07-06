/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect, useState, type ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Page } from './types';
import DashboardLayout from './components/DashboardLayout';
import ScrollToTop from './components/ScrollToTop';
import type { ReflectionDeckData } from './components/ui/ReflectionDeck';
import { ModalCloseButton, ModalShell } from './components/ui/ModalShell';

import { ChildProvider } from './context/ChildContext';
import { LockerProvider } from './context/LockerContext';
import { useCurrentChild } from './context/ChildContext';
import { DisplayModeProvider, useDisplayMode } from './context/DisplayModeContext';
import { SecondaryUsersProvider } from './context/SecondaryUsersContext';
import { getChildSubheading } from './lib/childStatus';
import {
  applyThreadlineVisualStyle,
  getStoredThreadlineVisualStyle,
  THREADLINE_STYLE_STORAGE_KEY,
} from './lib/visualStyles';

const AddChildFlow = lazy(() => import('./components/AddChildFlow'));
const AllChildrenPage = lazy(() => import('./components/AllChildrenPage'));
const AssessmentPage = lazy(() => import('./components/AssessmentPage'));
const DiaryPage = lazy(() => import('./components/DiaryPage'));
const DocumentsPage = lazy(() => import('./components/DocumentsPage'));
const EmergingDetailsPage = lazy(() => import('./components/EmergingDetailsPage'));
const HomePage = lazy(() => import('./components/HomePage'));
const NewChildPreviewPage = lazy(() => import('./components/NewChildPreviewPage'));
const PrioritiesPage = lazy(() => import('./components/PrioritiesPage'));
const ResourcesPage = lazy(() => import('./components/ResourcesPage'));
const ReflectionDeck = lazy(() => import('./components/ui/ReflectionDeck').then((module) => ({ default: module.ReflectionDeck })));
const ReviewsPage = lazy(() => import('./components/ReviewsPage'));
const SettingsPage = lazy(() => import('./components/SettingsPage'));
const StyleGuidePage = lazy(() => import('./components/StyleGuidePage'));
const UnderstandingPage = lazy(() => import('./components/UnderstandingPage'));
const WhatYouNoticedPage = lazy(() => import('./components/WhatYouNoticedPage'));
const QuestionnairePage = lazy(() => import('./components/QuestionnairePage'));

function RouteLoadingFallback() {
  return (
    <div className="min-h-[240px] flex items-center justify-center text-[0.78rem] tracking-[0.14em] uppercase text-slate-400">
      Loading
    </div>
  );
}

function resetStoredStateIfRequested() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  if (params.get('reset') !== '1') return;

  [
    'threadline-children',
    'threadline-current-child',
    'threadline-demo-data-version',
    'thread-theme',
    'thread-font',
    THREADLINE_STYLE_STORAGE_KEY,
    'thread-hero-style',
    'thread-secondary-style',
  ].forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage can be unavailable in restricted contexts; the app will still use defaults.
    }
  });

  window.history.replaceState({}, '', '/');
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentChild, createNewChild } = useCurrentChild();
  const { isMvp } = useDisplayMode();
  
  // Derive currentPage from location
  const getCurrentPage = (): Page => {
    const path = location.pathname.substring(1) || 'all-children';
    return path as Page;
  };

  const currentPage = getCurrentPage();

  // Initialize visual style safely from localStorage or fallback
  useEffect(() => {
    applyThreadlineVisualStyle(getStoredThreadlineVisualStyle(), { persist: false });
  }, []);

  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [setupInitialStep, setSetupInitialStep] = useState<1 | 2 | 3 | 4 | 5 | "welcome">("welcome");
  const [reflectionDeck, setReflectionDeck] = useState<ReflectionDeckData | null>(null);

  const showReflectionDeck = (data: ReflectionDeckData) => setReflectionDeck(data);
  const closeReflectionDeck = () => setReflectionDeck(null);

  const handlePageChange = (page: Page) => {
    navigate(`/${page === 'all-children' ? '' : page}`);
  };

  const handleAddChildRequest = () => {
    createNewChild();
    openSetup("welcome");
  };

  const openSetup = (step: 1 | 2 | 3 | 4 | 5 | "welcome" = "welcome") => {
    setSetupInitialStep(step);
    setIsSetupOpen(true);
  };
  const closeSetup = () => setIsSetupOpen(false);

  const handleShowPathway = (child: any) => {
    if (isMvp) return;
    const childName = child.firstName || child.name || "your child";
    showReflectionDeck({
      childName,
      navigatorHelp: "Guiding the next gentle step.",
      nextStep: "Review priorities together",
      selectedNotices: child.intake?.notices || [],
      availableInfo: child.intake?.availableInfo || [],
      questionnaireAnswers: child.intake?.answers,
      initialSlideIndex: 3,
      isPathwayOnly: true,
    });
  };

  const withPreAssessmentGuard = (element: ReactElement) => (
    currentChild.isNew ? <NewChildPreviewPage onPageChange={handlePageChange} onOpenSetup={openSetup} onShowPathway={handleShowPathway} /> : element
  );

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteLoadingFallback />}>
        {isSetupOpen && (
          <AddChildFlow
            asModal
            initialStep={setupInitialStep}
            onComplete={closeSetup}
            onCancel={closeSetup}
            onShowReflection={showReflectionDeck}
          />
        )}
        {reflectionDeck && (
          <ModalShell
            isOpen={Boolean(reflectionDeck)}
            titleId="reflection-deck-title"
            className="p-4 sm:p-6"
            maxWidthClassName="max-w-4xl"
            zIndexClassName="z-[60]"
            panelClassName="shadow-premium"
          >
            <h2 id="reflection-deck-title" className="sr-only">
              Reflection summary
            </h2>
            <ModalCloseButton
              onClick={closeReflectionDeck}
              label="Close reflection summary"
              className="absolute right-4 top-4 z-10 h-9 w-9 bg-white/80 shadow-sm hover:bg-white"
              iconClassName="h-4 w-4"
            />
            <ReflectionDeck
              childName={reflectionDeck.childName}
              navigatorHelp={reflectionDeck.navigatorHelp}
              nextStep={reflectionDeck.nextStep}
              selectedNotices={reflectionDeck.selectedNotices}
              availableInfo={reflectionDeck.availableInfo}
              questionnaireAnswers={reflectionDeck.questionnaireAnswers}
              initialSlideIndex={reflectionDeck.initialSlideIndex}
              isPathwayOnly={reflectionDeck.isPathwayOnly}
              onBackToSetup={closeReflectionDeck}
              onGoToProfile={closeReflectionDeck}
              onSetUpAnotherChild={closeReflectionDeck}
            />
          </ModalShell>
        )}
        <Routes>
          <Route path="/setup" element={
            <AddChildFlow
              onComplete={() => {
                const params = new URLSearchParams(window.location.search);
                const fromParam = params.get('from');
                if (fromParam) {
                  handlePageChange(fromParam as Page);
                } else {
                  handlePageChange('all-children');
                }
              }}
              onCancel={() => {
                const params = new URLSearchParams(window.location.search);
                const fromParam = params.get('from');
                if (fromParam) {
                  handlePageChange(fromParam as Page);
                } else {
                  handlePageChange('all-children');
                }
              }}
              onShowReflection={showReflectionDeck}
            />
          } />
          <Route path="*" element={
            <DashboardLayout
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onAddChildRequest={handleAddChildRequest}
              onShowPathway={handleShowPathway}
            >
              <Routes>
                <Route path="/" element={<AllChildrenPage onPageChange={handlePageChange} onShowPathway={handleShowPathway} />} />
                <Route path="/home" element={withPreAssessmentGuard(<HomePage onPageChange={handlePageChange} onOpenSetup={openSetup} onShowPathway={handleShowPathway} />)} />
                <Route path="/assessment" element={<AssessmentPage />} />
                <Route path="/preview" element={<NewChildPreviewPage onPageChange={handlePageChange} onOpenSetup={openSetup} onShowPathway={handleShowPathway} />} />
                <Route path="/what-you-noticed" element={isMvp ? <Navigate to="/home" replace /> : (currentChild.isNew ? <WhatYouNoticedPage onPageChange={handlePageChange} onOpenSetup={openSetup} onShowPathway={handleShowPathway} /> : <Navigate to="/home" replace />)} />
                <Route path="/understanding" element={isMvp ? <Navigate to="/home" replace /> : <UnderstandingPage onPageChange={handlePageChange} onOpenSetup={openSetup} />} />
                <Route path="/priorities" element={isMvp ? <Navigate to="/home" replace /> : <PrioritiesPage onPageChange={handlePageChange} />} />
                <Route path="/roadmap" element={<Navigate to={currentChild.isNew ? "/home" : (isMvp ? "/home" : "/reviews")} replace />} />
                <Route path="/reviews" element={isMvp ? <Navigate to="/home" replace /> : withPreAssessmentGuard(<ReviewsPage onPageChange={handlePageChange} onOpenSetup={openSetup} onShowPathway={handleShowPathway} />)} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/diary" element={isMvp ? <Navigate to="/home" replace /> : <DiaryPage />} />
                <Route path="/questionnaire" element={<QuestionnairePage />} />
                <Route path="/settings" element={
                  <SettingsPage
                    onPageChange={handlePageChange}
                    onAddChildRequest={handleAddChildRequest}
                  />
                } />
                <Route path="/emerging-details" element={withPreAssessmentGuard(<EmergingDetailsPage onPageChange={handlePageChange} />)} />
                <Route path="/style-guide" element={<StyleGuidePage onPageChange={handlePageChange} />} />
                <Route path="*" element={<AllChildrenPage onPageChange={handlePageChange} />} />
              </Routes>
            </DashboardLayout>
          } />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  resetStoredStateIfRequested();

  return (
    <BrowserRouter>
      <DisplayModeProvider>
        <ChildProvider>
          <LockerProvider>
            <SecondaryUsersProvider>
              <AppContent />
            </SecondaryUsersProvider>
          </LockerProvider>
        </ChildProvider>
      </DisplayModeProvider>
    </BrowserRouter>
  );
}
