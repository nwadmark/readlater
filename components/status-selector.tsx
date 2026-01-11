"use client";

import { updateLinkStatus } from "@/app/actions";
import { useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface StatusSelectorProps {
  linkId: string;
  currentStatus: "SAVED" | "IN_PROGRESS" | "FINISHED";
  size?: "sm" | "default";
}

export function StatusSelector({ linkId, currentStatus, size = "default" }: StatusSelectorProps) {
  const [isPending, startTransition] = useTransition();

  const statusConfig = {
    SAVED: { label: "To Read", color: "#3B82F6", bgColor: "bg-blue-500" },
    IN_PROGRESS: { label: "In Progress", color: "#F59E0B", bgColor: "bg-amber-500" },
    FINISHED: { label: "Completed", color: "#10B981", bgColor: "bg-green-500" },
  };

  const config = statusConfig[currentStatus];

  const handleStatusChange = (newStatus: "SAVED" | "IN_PROGRESS" | "FINISHED") => {
    if (newStatus === currentStatus) return;

    startTransition(async () => {
      await updateLinkStatus(linkId, newStatus);
    });
  };

  const buttonSize = size === "sm"
    ? "px-2 py-0.5 text-[0.75rem]"
    : "px-2.5 py-1 text-[0.8125rem]";
  const dotSize = size === "sm" ? "size-1" : "size-1.5";
  const chevronSize = size === "sm" ? "size-2.5" : "size-3";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`inline-flex items-center gap-1.5 ${buttonSize} rounded-full bg-background border border-border/40 hover:border-border/80 transition-all duration-200 font-medium text-foreground/70`}
          disabled={isPending}
          onClick={(e) => e.stopPropagation()}
        >
          <span className={`${dotSize} rounded-full ${config.bgColor}`} />
          {config.label}
          <ChevronDown className={`${chevronSize} opacity-50`} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()} className="min-w-[140px]">
        <DropdownMenuItem onClick={() => handleStatusChange("SAVED")}>
          <span className="size-1.5 rounded-full bg-blue-500 mr-2" />
          To Read
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("IN_PROGRESS")}>
          <span className="size-1.5 rounded-full bg-amber-500 mr-2" />
          In Progress
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("FINISHED")}>
          <span className="size-1.5 rounded-full bg-green-500 mr-2" />
          Completed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
