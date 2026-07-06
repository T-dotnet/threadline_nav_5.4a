import type { DiaryAttachment } from "../types";

export const DIARY_TAGS = [
  "Sleep",
  "Food",
  "Mood",
  "Medication",
  "School",
  "Routine",
  "Energy",
  "Behaviour",
] as const;

export const MAX_ATTACHMENTS = 4;
export const MAX_FILE_BYTES = 2 * 1024 * 1024;
export const ALLOWED_DOC_EXTENSIONS = ["pdf", "doc", "docx", "txt", "rtf"];

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

export function isAllowedFile(file: File) {
  if (file.type.startsWith("image/")) return true;
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  return ALLOWED_DOC_EXTENSIONS.includes(extension);
}

export function getAttachmentKind(file: File): DiaryAttachment["kind"] {
  return file.type.startsWith("image/") ? "image" : "document";
}

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error(`Unable to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}
