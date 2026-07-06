import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState, useCallback } from "react";

type DisplayMode = "classic" | "parent-clarity";
export type PreparationChecklistView = "timeline" | "cards" | "changed";
export type QuestionnaireModuleView = "cards" | "rows" | "checklist";

interface DisplayModeContextType {
  displayMode: DisplayMode;
  isParentClarity: boolean;
  isMvp: boolean;
  useQuestionnaireCards: boolean;
  questionnaireModuleView: QuestionnaireModuleView;
  preparationChecklistView: PreparationChecklistView;
  setIsMvp: (isMvp: boolean) => void;
  setUseQuestionnaireCards: (useCards: boolean) => void;
  setQuestionnaireModuleView: (view: QuestionnaireModuleView) => void;
  setPreparationChecklistView: (view: PreparationChecklistView) => void;
}

const DisplayModeContext = createContext<DisplayModeContextType | undefined>(undefined);
const DISPLAY_DEFAULTS_VERSION_KEY = "threadline-display-defaults-version";
const DISPLAY_DEFAULTS_VERSION = "mvp-cards-cards-v1";
const DEFAULT_IS_MVP = true;
const DEFAULT_PREPARATION_CHECKLIST_VIEW: PreparationChecklistView = "cards";
const DEFAULT_QUESTIONNAIRE_MODULE_VIEW: QuestionnaireModuleView = "cards";

function initializeDisplayDefaults() {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(DISPLAY_DEFAULTS_VERSION_KEY) === DISPLAY_DEFAULTS_VERSION) return;
    localStorage.setItem("threadline-is-mvp", String(DEFAULT_IS_MVP));
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
      if (storedView === "timeline" || storedView === "cards" || storedView === "changed") {
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
      if (storedView === "cards" || storedView === "rows" || storedView === "checklist") {
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

  const setIsMvp = useCallback((mvp: boolean) => {
    setIsMvpState(mvp);
    try {
      localStorage.setItem("threadline-is-mvp", String(mvp));
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
  }, []);

  const value = useMemo(
    () => ({
      displayMode,
      isParentClarity: true,
      isMvp,
      useQuestionnaireCards,
      questionnaireModuleView,
      preparationChecklistView,
      setIsMvp,
      setUseQuestionnaireCards,
      setQuestionnaireModuleView,
      setPreparationChecklistView,
    }),
    [isMvp, setIsMvp, useQuestionnaireCards, questionnaireModuleView, preparationChecklistView, setUseQuestionnaireCards, setQuestionnaireModuleView, setPreparationChecklistView],
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
