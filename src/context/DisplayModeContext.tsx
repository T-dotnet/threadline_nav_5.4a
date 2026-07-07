import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState, useCallback } from "react";

type DisplayMode = "classic" | "parent-clarity";
export type PreparationChecklistView = "timeline" | "cards" | "changed" | "package";
export type QuestionnaireModuleView = "cards" | "rows" | "checklist" | "package";
export type PackageHighlightStyle = "standard" | "purple" | "blue-purple";

interface DisplayModeContextType {
  displayMode: DisplayMode;
  isParentClarity: boolean;
  isMvp: boolean;
  useQuestionnaireCards: boolean;
  useRegularSansHeadings: boolean;
  usePurplePackageHighlights: boolean;
  packageHighlightStyle: PackageHighlightStyle;
  questionnaireModuleView: QuestionnaireModuleView;
  preparationChecklistView: PreparationChecklistView;
  setIsMvp: (isMvp: boolean) => void;
  setUseRegularSansHeadings: (useRegularSansHeadings: boolean) => void;
  setUsePurplePackageHighlights: (usePurplePackageHighlights: boolean) => void;
  setPackageHighlightStyle: (packageHighlightStyle: PackageHighlightStyle) => void;
  setUseQuestionnaireCards: (useCards: boolean) => void;
  setQuestionnaireModuleView: (view: QuestionnaireModuleView) => void;
  setPreparationChecklistView: (view: PreparationChecklistView) => void;
}

const DisplayModeContext = createContext<DisplayModeContextType | undefined>(undefined);
const DISPLAY_DEFAULTS_VERSION_KEY = "threadline-display-defaults-version";
const DISPLAY_DEFAULTS_VERSION = "mvp-package-package-highlight-standard-v1";
const DEFAULT_IS_MVP = true;
const DEFAULT_USE_REGULAR_SANS_HEADINGS = true;
const DEFAULT_PACKAGE_HIGHLIGHT_STYLE: PackageHighlightStyle = "standard";
const DEFAULT_PREPARATION_CHECKLIST_VIEW: PreparationChecklistView = "package";
const DEFAULT_QUESTIONNAIRE_MODULE_VIEW: QuestionnaireModuleView = "package";

function isPackageHighlightStyle(value: string | null): value is PackageHighlightStyle {
  return value === "standard" || value === "purple" || value === "blue-purple";
}

function initializeDisplayDefaults() {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(DISPLAY_DEFAULTS_VERSION_KEY) === DISPLAY_DEFAULTS_VERSION) return;
    localStorage.setItem("threadline-is-mvp", String(DEFAULT_IS_MVP));
    localStorage.setItem("threadline-use-regular-sans-headings", String(DEFAULT_USE_REGULAR_SANS_HEADINGS));
    localStorage.setItem("threadline-package-highlight-style", DEFAULT_PACKAGE_HIGHLIGHT_STYLE);
    localStorage.setItem("threadline-use-purple-package-highlights", String(DEFAULT_PACKAGE_HIGHLIGHT_STYLE === "purple"));
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

  const [packageHighlightStyle, setPackageHighlightStyleState] = useState<PackageHighlightStyle>(() => {
    if (typeof window === "undefined") return DEFAULT_PACKAGE_HIGHLIGHT_STYLE;
    try {
      initializeDisplayDefaults();
      const storedStyle = localStorage.getItem("threadline-package-highlight-style");
      if (isPackageHighlightStyle(storedStyle)) return storedStyle;

      const storedPurple = localStorage.getItem("threadline-use-purple-package-highlights");
      return storedPurple === "true" ? "purple" : DEFAULT_PACKAGE_HIGHLIGHT_STYLE;
    } catch {
      return DEFAULT_PACKAGE_HIGHLIGHT_STYLE;
    }
  });
  const usePurplePackageHighlights = packageHighlightStyle === "purple";

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

  const setUsePurplePackageHighlights = useCallback((usePurple: boolean) => {
    const nextStyle: PackageHighlightStyle = usePurple ? "purple" : "standard";
    setPackageHighlightStyleState(nextStyle);
    try {
      localStorage.setItem("threadline-use-purple-package-highlights", String(usePurple));
      localStorage.setItem("threadline-package-highlight-style", nextStyle);
    } catch (e) {
      console.warn("Storage access is blocked or restricted:", e);
    }
  }, []);

  const setPackageHighlightStyle = useCallback((style: PackageHighlightStyle) => {
    setPackageHighlightStyleState(style);
    try {
      localStorage.setItem("threadline-package-highlight-style", style);
      localStorage.setItem("threadline-use-purple-package-highlights", String(style === "purple"));
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
    document.documentElement.setAttribute("data-purple-package-highlights", String(usePurplePackageHighlights));
    document.documentElement.setAttribute("data-package-highlight-style", packageHighlightStyle);
  }, [displayMode, isMvp, useRegularSansHeadings, usePurplePackageHighlights, packageHighlightStyle]);

  const value = useMemo(
    () => ({
      displayMode,
      isParentClarity: true,
      isMvp,
      useQuestionnaireCards,
      useRegularSansHeadings,
      usePurplePackageHighlights,
      packageHighlightStyle,
      questionnaireModuleView,
      preparationChecklistView,
      setIsMvp,
      setUseRegularSansHeadings,
      setUsePurplePackageHighlights,
      setPackageHighlightStyle,
      setUseQuestionnaireCards,
      setQuestionnaireModuleView,
      setPreparationChecklistView,
    }),
    [isMvp, setIsMvp, useQuestionnaireCards, useRegularSansHeadings, usePurplePackageHighlights, packageHighlightStyle, questionnaireModuleView, preparationChecklistView, setUseRegularSansHeadings, setUsePurplePackageHighlights, setPackageHighlightStyle, setUseQuestionnaireCards, setQuestionnaireModuleView, setPreparationChecklistView],
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
