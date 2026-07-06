export type ThreadlineVisualStyle =
  | "current"
  | "slate-synthesis"
  | "reference-plum"
  | "rosewater";

export interface ThreadlineStyleOption {
  id: ThreadlineVisualStyle;
  label: string;
  description: string;
  swatches: string[];
  theme: "energetic" | "classic" | "slate-synthesis";
  font: "modern-serif" | "classic-serif";
  heroStyle: "white" | "green";
  secondaryStyle: "light" | "dark";
}

export interface ThreadlineThemeTokens {
  midGreen: string;
  lightGreen: string;
  heading: string;
  darkest: string;
  offWhite: string;
}

export const THREADLINE_STYLE_STORAGE_KEY = "thread-visual-style";

export const THREADLINE_THEME_TOKENS: Record<string, ThreadlineThemeTokens> = {
  energetic: {
    midGreen: "#108560",
    lightGreen: "#E6F4ED",
    heading: "#0B4636",
    darkest: "#0A1F1B",
    offWhite: "#F5F7F6",
  },
  classic: {
    midGreen: "#2A5B4A",
    lightGreen: "#E3EBE7",
    heading: "#16362D",
    darkest: "#0B1613",
    offWhite: "#F5F5F5",
  },
  "slate-synthesis": {
    midGreen: "#9280af",
    lightGreen: "#E6F4ED",
    heading: "#314158",
    darkest: "#0A1F1B",
    offWhite: "#F5F7F6",
  },
};

export const THREADLINE_STYLE_OPTIONS: ThreadlineStyleOption[] = [
  {
    id: "current",
    label: "Current",
    description: "Existing Threadline green and white system.",
    swatches: ["#108560", "#E6F4ED", "#FFFFFF"],
    theme: "energetic",
    font: "modern-serif",
    heroStyle: "white",
    secondaryStyle: "light",
  },
  {
    id: "slate-synthesis",
    label: "Slate Synthesis",
    description: "A refined palette with slate headings and vibrant purple accents.",
    swatches: ["#314158", "#9280af", "#FFFFFF"],
    theme: "slate-synthesis",
    font: "modern-serif",
    heroStyle: "white",
    secondaryStyle: "light",
  },
  {
    id: "reference-plum",
    label: "Reference Plum",
    description: "Screenshot-inspired plum type with tinted feature cards.",
    swatches: ["#56094F", "#ECEBED", "#E9F4EE"],
    theme: "energetic",
    font: "modern-serif",
    heroStyle: "white",
    secondaryStyle: "light",
  },
  {
    id: "rosewater",
    label: "Rosewater",
    description: "Soft mauve and rose accents with calm green support.",
    swatches: ["#7C315D", "#F3E9ED", "#E9F4EE"],
    theme: "energetic",
    font: "modern-serif",
    heroStyle: "white",
    secondaryStyle: "light",
  },
];

export const isThreadlineVisualStyle = (value: string | null): value is ThreadlineVisualStyle =>
  THREADLINE_STYLE_OPTIONS.some((option) => option.id === value);

export function getStoredThreadlineVisualStyle(): ThreadlineVisualStyle {
  if (typeof window === "undefined") return "current";

  try {
    const storedStyle = localStorage.getItem(THREADLINE_STYLE_STORAGE_KEY);
    return isThreadlineVisualStyle(storedStyle) ? storedStyle : "current";
  } catch {
    return "current";
  }
}

export function applyThreadlineVisualStyle(
  style: ThreadlineVisualStyle,
  { persist = true }: { persist?: boolean } = {},
) {
  const option = THREADLINE_STYLE_OPTIONS.find((item) => item.id === style) ?? THREADLINE_STYLE_OPTIONS[0];

  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-visual-style", option.id);
    document.documentElement.setAttribute("data-theme", option.theme);
    document.documentElement.setAttribute("data-font", option.font);
    document.documentElement.setAttribute("data-hero-style", option.heroStyle);
    document.documentElement.setAttribute("data-hero-secondary", option.secondaryStyle);
  }

  if (!persist || typeof window === "undefined") return;

  try {
    localStorage.setItem(THREADLINE_STYLE_STORAGE_KEY, option.id);
    localStorage.setItem("thread-theme", option.theme);
    localStorage.setItem("thread-font", option.font);
    localStorage.setItem("thread-hero-style", option.heroStyle);
    localStorage.setItem("thread-secondary-style", option.secondaryStyle);
  } catch {
    // The applied DOM attributes are enough when storage is unavailable.
  }
}
