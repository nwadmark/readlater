"use client";

import { useState, useTransition } from "react";
import { deleteLink } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteLinkButtonProps {
  linkId: string;
  variant?: "icon" | "button";
  redirectAfterDelete?: string;
  onDeleteStart?: () => void;
}

export function DeleteLinkButton({
  linkId,
  variant = "icon",
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
    return (
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {showConfirm ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClick}
              disabled={isPending}
              className="h-7 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              {isPending ? "Deleting..." : "Confirm"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isPending}
              className="h-7 px-2 text-xs text-foreground/40 hover:text-foreground"
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
            className="h-auto w-auto p-0 hover:text-red-500 hover:bg-transparent"
          >
            <Trash2 className="size-[18px]" />
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
