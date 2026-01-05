"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil } from "lucide-react";
import { updateLinkTitle } from "@/app/actions";

type EditableTitleProps = {
  linkId: string;
  title: string | null;
  url: string;
  className?: string;
};

export function EditableTitle({ linkId, title, url, className = "" }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title || "");
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (isSaving) return;

    const newTitle = editValue.trim();
    if (newTitle === (title || "")) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await updateLinkTitle(linkId, newTitle);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update title:", error);
      setEditValue(title || "");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(title || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          disabled={isSaving}
          className="flex-1 text-[1.0625rem] font-semibold leading-snug text-foreground bg-white border border-[#3B82F6] rounded px-2 py-1 outline-none"
          placeholder="Enter title..."
        />
      </div>
    );
  }

  return (
    <div className="group/title flex items-start gap-2">
      <h3 className={className}>
        {title || url}
      </h3>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsEditing(true);
        }}
        className="opacity-0 group-hover/title:opacity-100 transition-opacity p-1 hover:bg-[#F5F5F5] rounded"
        title="Edit title"
      >
        <Pencil className="size-4 text-[#6b7280]" />
      </button>
    </div>
  );
}
