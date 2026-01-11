"use client";

import { useState, useTransition } from "react";
import { deleteLink } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteLinkButtonProps {
  linkId: string;
  variant?: "icon" | "button";
  size?: "sm" | "default";
  redirectAfterDelete?: string;
  onDeleteStart?: () => void;
}

export function DeleteLinkButton({
  linkId,
  variant = "icon",
  size = "default",
  redirectAfterDelete,
  onDeleteStart,
}: DeleteLinkButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    onDeleteStart?.();
    startTransition(async () => {
      await deleteLink(linkId);
      if (redirectAfterDelete) {
        router.push(redirectAfterDelete);
      }
    });
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleDelete();
  };

  if (variant === "icon") {
    const iconSize = size === "sm" ? "size-4" : "size-5";
    const buttonSize = size === "sm" ? "h-8 w-8 p-1.5" : "h-10 w-10 p-2";
    const confirmSize = size === "sm" ? "h-6 px-1.5 text-[0.6875rem]" : "h-7 px-2 text-xs";

    return (
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {showConfirm ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClick}
              disabled={isPending}
              className={`${confirmSize} text-red-500 hover:text-red-600 hover:bg-red-50`}
            >
              {isPending ? "Deleting..." : "Confirm"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isPending}
              className={`${confirmSize} text-foreground/40 hover:text-foreground`}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClick}
            disabled={isPending}
            className={`${buttonSize} hover:text-red-500 hover:bg-muted/50`}
            title="Delete link"
          >
            <Trash2 className={iconSize} />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {showConfirm ? (
        <div className="flex items-center gap-3">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClick}
            disabled={isPending}
            className="h-9"
          >
            {isPending ? "Deleting..." : "Confirm Delete"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleCancel} disabled={isPending} className="h-9">
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={isPending}
          className="h-9 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Link
        </Button>
      )}
    </div>
  );
}
