import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState, useCallback } from "react";

type DisplayMode = "classic" | "parent-clarity";
export type PreparationChecklistView = "timeline" | "cards" | "changed" | "package";
export type QuestionnaireModuleView = "cards" | "rows" | "checklist" | "package";

interface DisplayModeContextType {
  displayMode: DisplayMode;
  isParentClarity: boolean;
  isMvp: boolean;
  useQuestionnaireCards: boolean;
  useRegularSansHeadings: boolean;
  showAssessmentProgressCircle: boolean;
  hideRubyHighlightNoah: boolean;
  showDiagnosticAssessmentPlaceholder: boolean;
  questionnaireModuleView: QuestionnaireModuleView;
  preparationChecklistView: PreparationChecklistView;
  setIsMvp: (isMvp: boolean) => void;
  setUseRegularSansHeadings: (useRegularSansHeadings: boolean) => void;
  setShowAssessmentProgressCircle: (showAssessmentProgressCircle: boolean) => void;
  setHideRubyHighlightNoah: (hideRubyHighlightNoah: boolean) => void;
  setShowDiagnosticAssessmentPlaceholder: (showDiagnosticAssessmentPlaceholder: boolean) => void;
  setUseQuestionnaireCards: (useCards: boolean) => void;
  setQuestionnaireModuleView: (view: QuestionnaireModuleView) => void;
  setPreparationChecklistView: (view: PreparationChecklistView) => void;
}

const DisplayModeContext = createContext<DisplayModeContextType | undefined>(undefined);
const DISPLAY_DEFAULTS_VERSION_KEY = "threadline-display-defaults-version";
const DISPLAY_DEFAULTS_VERSION = "mvp-package-package-regular-headings-ruby-noah-v1";
const DEFAULT_IS_MVP = true;
const DEFAULT_USE_REGULAR_SANS_HEADINGS = true;
const DEFAULT_SHOW_ASSESSMENT_PROGRESS_CIRCLE = false;
const DEFAULT_HIDE_RUBY_HIGHLIGHT_NOAH = true;
const DEFAULT_SHOW_DIAGNOSTIC_ASSESSMENT_PLACEHOLDER = true;
const DEFAULT_PREPARATION_CHECKLIST_VIEW: PreparationChecklistView = "package";
const DEFAULT_QUESTIONNAIRE_MODULE_VIEW: QuestionnaireModuleView = "package";

function initializeDisplayDefaults() {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(DISPLAY_DEFAULTS_VERSION_KEY) === DISPLAY_DEFAULTS_VERSION) return;
    localStorage.setItem("threadline-is-mvp", String(DEFAULT_IS_MVP));
    localStorage.setItem("threadline-use-regular-sans-headings", String(DEFAULT_USE_REGULAR_SANS_HEADINGS));
    localStorage.setItem("threadline-assessment-progress-circle-card", String(DEFAULT_SHOW_ASSESSMENT_PROGRESS_CIRCLE));
    localStorage.setItem("threadline-hide-ruby-highlight-noah", String(DEFAULT_HIDE_RUBY_HIGHLIGHT_NOAH));
    localStorage.setItem("threadline-diagnostic-assessment-placeholder", String(DEFAULT_SHOW_DIAGNOSTIC_ASSESSMENT_PLACEHOLDER));
    localStorage.setItem("threadline-preparation-checklist-view", DEFAULT_PREPARATION_CHECKLIST_VIEW);
    localStorage.setItem("threadline-questionnaire-module-view", DEFAULT_QUESTIONNAIRE_MODULE_VIEW);
    localStorage.setItem("threadline-questionnaire-card-view", String(DEFAULT_QUESTIONNAIRE_MODULE_VIEW === "cards"));
    localStorage.setItem(DISPLAY_DEFAULTS_VERSION_KEY, DISPLAY_DEFAULTS_VERSION);
  } catch {
    // Storage can be unavailable in restricted contexts; in-memory defaults still work.
  }
}

export function DisplayModeProvider({ children }: { children: ReactNode }) {
  const displayMode: DisplayMode = "parent-clarity";

  const [isMvp, setIsMvpState] = useState<boolean>(() => {
    if (typeof window === "undefined") return DEFAULT_IS_MVP;
    try {
      initializeDisplayDefaults();
      const stored = localStorage.getItem("threadline-is-mvp");
      return stored !== null ? stored === "true" : DEFAULT_IS_MVP;
    } catch {
      return DEFAULT_IS_MVP;
    }
  });

  const [preparationChecklistView, setPreparationChecklistViewState] = useState<PreparationChecklistView>(() => {
    if (typeof window === "undefined") return DEFAULT_PREPARATION_CHECKLIST_VIEW;
    try {
      initializeDisplayDefaults();
      const storedView = localStorage.getItem("threadline-preparation-checklist-view");
      if (storedView === "timeline" || storedView === "cards" || storedView === "changed" || storedView === "package") {
        return storedView;
      }

      return DEFAULT_PREPARATION_CHECKLIST_VIEW;
    } catch {
      return DEFAULT_PREPARATION_CHECKLIST_VIEW;
    }
  });

  const [questionnaireModuleView, setQuestionnaireModuleViewState] = useState<QuestionnaireModuleView>(() => {
    if (typeof window === "undefined") return DEFAULT_QUESTIONNAIRE_MODULE_VIEW;
    try {
      initializeDisplayDefaults();
      const storedView = localStorage.getItem("threadline-questionnaire-module-view");
      if (storedView === "cards" || storedView === "rows" || storedView === "checklist" || storedView === "package") {
        return storedView;
      }

      const stored = localStorage.getItem("threadline-questionnaire-card-view");
      return stored !== null
        ? stored === "true" ? "cards" : "rows"
        : DEFAULT_QUESTIONNAIRE_MODULE_VIEW;
    } catch {
      return DEFAULT_QUESTIONNAIRE_MODULE_VIEW;
    }
  });
  const useQuestionnaireCards = questionnaireModuleView === "cards";

  const [useRegularSansHeadings, setUseRegularSansHeadingsState] = useState<boolean>(() => {
    if (typeof window === "undefined") return DEFAULT_USE_REGULAR_SANS_HEADINGS;
    try {
      initializeDisplayDefaults();
      const stored = localStorage.getItem("threadline-use-regular-sans-headings");
      return stored !== null ? stored === "true" : DEFAULT_USE_REGULAR_SANS_HEADINGS;
    } catch {
      return DEFAULT_USE_REGULAR_SANS_HEADINGS;
    }
  });

  const [showAssessmentProgressCircle, setShowAssessmentProgressCircleState] = useState<boolean>(() => {
    if (typeof window === "undefined") return DEFAULT_SHOW_ASSESSMENT_PROGRESS_CIRCLE;
    try {
      initializeDisplayDefaults();
      const stored = localStorage.getItem("threadline-assessment-progress-circle-card");
      return stored !== null ? stored === "true" : DEFAULT_SHOW_ASSESSMENT_PROGRESS_CIRCLE;
    } catch {
      return DEFAULT_SHOW_ASSESSMENT_PROGRESS_CIRCLE;
    }
  });

  const [hideRubyHighlightNoah, setHideRubyHighlightNoahState] = useState<boolean>(() => {
    if (typeof window === "undefined") return DEFAULT_HIDE_RUBY_HIGHLIGHT_NOAH;
    try {
      initializeDisplayDefaults();
      const stored = localStorage.getItem("threadline-hide-ruby-highlight-noah");
      return stored !== null ? stored === "true" : DEFAULT_HIDE_RUBY_HIGHLIGHT_NOAH;
    } catch {
      return DEFAULT_HIDE_RUBY_HIGHLIGHT_NOAH;
    }
  });

  const [showDiagnosticAssessmentPlaceholder, setShowDiagnosticAssessmentPlaceholderState] = useState<boolean>(() => {
    if (typeof window === "undefined") return DEFAULT_SHOW_DIAGNOSTIC_ASSESSMENT_PLACEHOLDER;
    try {
      initializeDisplayDefaults();
      const stored = localStorage.getItem("threadline-diagnostic-assessment-placeholder");
      return stored !== null ? stored === "true" : DEFAULT_SHOW_DIAGNOSTIC_ASSESSMENT_PLACEHOLDER;
    } catch {
      return DEFAULT_SHOW_DIAGNOSTIC_ASSESSMENT_PLACEHOLDER;
    }
  });

  const setIsMvp = useCallback((mvp: boolean) => {
    setIsMvpState(mvp);
    try {
      localStorage.setItem("threadline-is-mvp", String(mvp));
    } catch (e) {
      console.warn("Storage access is blocked or restricted:", e);
    }
  }, []);

  const setUseRegularSansHeadings = useCallback((useRegular: boolean) => {
    setUseRegularSansHeadingsState(useRegular);
    try {
      localStorage.setItem("threadline-use-regular-sans-headings", String(useRegular));
    } catch (e) {
      console.warn("Storage access is blocked or restricted:", e);
    }
  }, []);

  const setShowAssessmentProgressCircle = useCallback((showCircle: boolean) => {
    setShowAssessmentProgressCircleState(showCircle);
    try {
      localStorage.setItem("threadline-assessment-progress-circle-card", String(showCircle));
    } catch (e) {
      console.warn("Storage access is blocked or restricted:", e);
    }
  }, []);

  const setHideRubyHighlightNoah = useCallback((hideAndHighlight: boolean) => {
    setHideRubyHighlightNoahState(hideAndHighlight);
    try {
      localStorage.setItem("threadline-hide-ruby-highlight-noah", String(hideAndHighlight));
    } catch (e) {
      console.warn("Storage access is blocked or restricted:", e);
    }
  }, []);

  const setShowDiagnosticAssessmentPlaceholder = useCallback((showPlaceholder: boolean) => {
    setShowDiagnosticAssessmentPlaceholderState(showPlaceholder);
    try {
      localStorage.setItem("threadline-diagnostic-assessment-placeholder", String(showPlaceholder));
    } catch (e) {
      console.warn("Storage access is blocked or restricted:", e);
    }
  }, []);

  const setPreparationChecklistView = useCallback((view: PreparationChecklistView) => {
    setPreparationChecklistViewState(view);
    try {
      localStorage.setItem("threadline-preparation-checklist-view", view);
    } catch (e) {
      console.warn("Storage access is blocked or restricted:", e);
    }
  }, []);

  const setQuestionnaireModuleView = useCallback((view: QuestionnaireModuleView) => {
    setQuestionnaireModuleViewState(view);
    try {
      localStorage.setItem("threadline-questionnaire-module-view", view);
      localStorage.setItem("threadline-questionnaire-card-view", String(view === "cards"));
    } catch (e) {
      console.warn("Storage access is blocked or restricted:", e);
    }
  }, []);

  const setUseQuestionnaireCards = useCallback((useCards: boolean) => {
    setQuestionnaireModuleView(useCards ? "cards" : "rows");
  }, [setQuestionnaireModuleView]);

  useEffect(() => {
    document.documentElement.setAttribute("data-display-mode", displayMode);
    document.documentElement.setAttribute("data-mvp", String(isMvp));
    document.documentElement.setAttribute("data-regular-sans-headings", String(useRegularSansHeadings));
    document.documentElement.removeAttribute("data-fresh-green-palette");
    document.documentElement.removeAttribute("data-purple-package-highlights");
    document.documentElement.removeAttribute("data-package-highlight-style");
  }, [displayMode, isMvp, useRegularSansHeadings]);

  const value = useMemo(
    () => ({
      displayMode,
      isParentClarity: true,
      isMvp,
      useQuestionnaireCards,
      useRegularSansHeadings,
      showAssessmentProgressCircle,
      hideRubyHighlightNoah,
      showDiagnosticAssessmentPlaceholder,
      questionnaireModuleView,
      preparationChecklistView,
      setIsMvp,
      setUseRegularSansHeadings,
      setShowAssessmentProgressCircle,
      setHideRubyHighlightNoah,
      setShowDiagnosticAssessmentPlaceholder,
      setUseQuestionnaireCards,
      setQuestionnaireModuleView,
      setPreparationChecklistView,
    }),
    [isMvp, setIsMvp, useQuestionnaireCards, useRegularSansHeadings, showAssessmentProgressCircle, hideRubyHighlightNoah, showDiagnosticAssessmentPlaceholder, questionnaireModuleView, preparationChecklistView, setUseRegularSansHeadings, setShowAssessmentProgressCircle, setHideRubyHighlightNoah, setShowDiagnosticAssessmentPlaceholder, setUseQuestionnaireCards, setQuestionnaireModuleView, setPreparationChecklistView],
  );

  return (
    <DisplayModeContext.Provider value={value}>
      {children}
    </DisplayModeContext.Provider>
  );
}

export function useDisplayMode() {
  const context = useContext(DisplayModeContext);
  if (!context) {
    throw new Error("useDisplayMode must be used within a DisplayModeProvider");
  }
  return context;
}
