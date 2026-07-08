export const DIAGNOSTIC_ASSESSMENT_PRICE = 395;

export const DIAGNOSTIC_DISCOUNT_CODES = {
  THREAD20: {
    label: "Threadline family discount",
    percentage: 20,
  },
  CARE10: {
    label: "Care access discount",
    percentage: 10,
  },
} as const;

export type DiagnosticDiscountCode = keyof typeof DIAGNOSTIC_DISCOUNT_CODES;

export const DIAGNOSTIC_DISCOUNT_CODE_EXAMPLE = Object.keys(
  DIAGNOSTIC_DISCOUNT_CODES,
)[0] as DiagnosticDiscountCode;

export function formatAssessmentPackagePrice(amount: number, includeCents = false) {
  return `A$${amount.toLocaleString("en-AU", {
    minimumFractionDigits: includeCents ? 2 : 0,
    maximumFractionDigits: includeCents ? 2 : 0,
  })}`;
}
