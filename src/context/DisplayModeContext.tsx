import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface DisplayModeContextType {
  isMvp: boolean;
  setIsMvp: (isMvp: boolean) => void;
}

const DisplayModeContext = createContext<DisplayModeContextType | undefined>(undefined);
const DEFAULT_IS_MVP = true;
const MVP_STORAGE_KEY = "threadline-is-mvp";

export function DisplayModeProvider({ children }: { children: ReactNode }) {
  const [isMvp, setIsMvpState] = useState<boolean>(() => {
    if (typeof window === "undefined") return DEFAULT_IS_MVP;

    try {
      const stored = localStorage.getItem(MVP_STORAGE_KEY);
      return stored !== null ? stored === "true" : DEFAULT_IS_MVP;
    } catch {
      return DEFAULT_IS_MVP;
    }
  });

  const setIsMvp = useCallback((nextIsMvp: boolean) => {
    setIsMvpState(nextIsMvp);
    try {
      localStorage.setItem(MVP_STORAGE_KEY, String(nextIsMvp));
    } catch (error) {
      console.warn("Storage access is blocked or restricted:", error);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-mvp", String(isMvp));
  }, [isMvp]);

  const value = useMemo(() => ({ isMvp, setIsMvp }), [isMvp, setIsMvp]);

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
