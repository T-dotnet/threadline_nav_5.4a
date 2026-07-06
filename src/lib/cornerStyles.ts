type RotatingCornerSize = 20 | 28 | 32;

const ROTATING_CORNER_CLASSES: Record<RotatingCornerSize, readonly string[]> = {
  20: [
    "rounded-tr-[20px]",
    "rounded-tl-[20px]",
    "rounded-br-[20px]",
    "rounded-bl-[20px]",
  ],
  28: [
    "rounded-tr-[28px]",
    "rounded-tl-[28px]",
    "rounded-br-[28px]",
    "rounded-bl-[28px]",
  ],
  32: [
    "rounded-tr-[32px]",
    "rounded-tl-[32px]",
    "rounded-br-[32px]",
    "rounded-bl-[32px]",
  ],
};

const FEATURE_CARD_CORNER_CLASSES = [
  "rounded-tr-[32px]",
  "rounded-tl-[32px]",
  "rounded-bl-[32px]",
] as const;

const LIST_ROW_CORNER_CLASSES = [
  "rounded-tl-[32px]",
  "rounded-tr-[32px]",
  "rounded-br-[32px]",
  "rounded-bl-[32px]",
] as const;

export function getRotatingCornerClass(index: number, size: RotatingCornerSize = 32) {
  const cornerClasses = ROTATING_CORNER_CLASSES[size];
  return cornerClasses[index % cornerClasses.length];
}

export function getFeatureCardCornerClass(index: number) {
  return FEATURE_CARD_CORNER_CLASSES[index] || FEATURE_CARD_CORNER_CLASSES[0];
}

export function getListRowCornerClass(index: number) {
  return LIST_ROW_CORNER_CLASSES[index % LIST_ROW_CORNER_CLASSES.length];
}
