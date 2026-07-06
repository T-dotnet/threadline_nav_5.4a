import * as React from "react";
import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Plus, Send } from "lucide-react";
import { cn } from "../../lib/utils";

export interface AICopilotBarProps {
  currentChildName: string;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function AICopilotBar({
  currentChildName,
  placeholder,
  className,
  id = "ai-copilot-container",
}: AICopilotBarProps) {
  const [aiInput, setAiInput] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() && !attachedFile) return;

    setIsSubmitting(true);
    setShowResponse(true);

    const userQuery = aiInput.toLowerCase();
    let response = `I've analyzed your request for ${currentChildName}. Let me prepare a tailored recommendation for you...`;

    if (
      userQuery.includes("letter") ||
      userQuery.includes("school") ||
      userQuery.includes("teacher")
    ) {
      response = `Drafted a school advocacy outline for ${currentChildName} regarding transition support. This asks teachers to offer clear visual warnings 3 minutes before any major routine changes. Ready in resources.`;
    } else if (
      userQuery.includes("routine") ||
      userQuery.includes("morning") ||
      userQuery.includes("at home")
    ) {
      response = `Recommended action: Create a structured routine grid of early morning stages for ${currentChildName}, utilising visual timers or tick-off charts.`;
    } else if (userQuery.includes("focus") || userQuery.includes("attention")) {
      response = `Instruction strategy: Introduce brief, 5-minute play-based co-regulation tactics for ${currentChildName} to anchor focus prior to high-performance tasks.`;
    } else {
      response = `AI analysis active: Preparing proactive behavioral and academic adjustments based on ${currentChildName}'s current clinical patterns.`;
    }

    setResponseMessage("Drafting recommendations...");

    setTimeout(() => {
      setResponseMessage(response);
      setIsSubmitting(false);
    }, 1200);

    setAiInput("");
  };

  return (
    <div id={id} className={cn("thread-ai-copilot", className)}>
      {showResponse && (
        <motion.div
          id="ai-copilot-response"
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="thread-ai-copilot__response"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            id="ai-copilot-close-btn"
            onClick={() => setShowResponse(false)}
            className="thread-ai-copilot__close"
          >
            ×
          </motion.button>
          <div className="thread-ai-copilot__label">
            Co-Pilot Assistant
          </div>
          <p
            id="ai-copilot-response-text"
            className={cn(
              "thread-ai-copilot__response-text",
              isSubmitting
                ? "thread-ai-copilot__response-text--loading"
                : "thread-ai-copilot__response-text--ready",
            )}
          >
            {responseMessage}
          </p>
        </motion.div>
      )}

      <form
        id="ai-copilot-form"
        onSubmit={handleAISubmit}
        className="thread-ai-copilot__form"
      >
        <input
          type="file"
          id="ai-file-upload"
          className="thread-ai-copilot__file-input"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <motion.button
          whileTap={{ scale: 0.92 }}
          type="button"
          id="ai-file-upload-trigger"
          onClick={triggerFileUpload}
          className="thread-ai-copilot__icon-button"
          title="Attach file"
        >
          <Plus className="thread-ai-copilot__file-icon" />
          {attachedFile && (
            <span className="thread-ai-copilot__file-dot" />
          )}
        </motion.button>

        <input
          type="text"
          id="ai-copilot-input-field"
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          placeholder={placeholder || `Ask AI or draft a letter for ${currentChildName}...`}
          className="thread-ai-copilot__input"
        />

        <motion.button
          whileTap={aiInput.trim() || attachedFile ? { scale: 0.92 } : undefined}
          type="submit"
          id="ai-copilot-submit-btn"
          disabled={!aiInput.trim() && !attachedFile}
          className={cn(
            "thread-ai-copilot__submit",
            aiInput.trim() || attachedFile
              ? "thread-ai-copilot__submit--ready"
              : "thread-ai-copilot__submit--disabled",
          )}
        >
          <Send className="thread-ai-copilot__send-icon" />
        </motion.button>
      </form>
      {attachedFile && (
        <div id="ai-copilot-attachment-status" className="thread-ai-copilot__attachment">
          <div className="thread-ai-copilot__attachment-pill">
            <span className="thread-ai-copilot__attachment-name">
              {attachedFile.name}
            </span>
            <button
              type="button"
              id="ai-copilot-remove-attachment-btn"
              onClick={() => setAttachedFile(null)}
              className="thread-ai-copilot__attachment-remove"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
