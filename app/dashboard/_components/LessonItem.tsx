"use client";

import { cn } from "@/lib/utils";
import { Check, Play, FileText } from "lucide-react";
import Link from "next/link";

interface iAppProps {
  lesson: {
    id: string;
    title: string;
    position: number;
    description: string | null;
    videoDuration?: string | null;
    lessonType?: "VIDEO" | "PDF" | null;
  };
  slug: string;
  chapterId: string;
  isActive?: boolean;
  completed: boolean;
}

export function LessonItem({
  lesson,
  slug,
  chapterId,
  isActive,
  completed,
}: iAppProps) {
  return (
    <Link
      href={`/dashboard/sections/${slug}/chapters/${chapterId}/${lesson.id}`}
      className={cn(
        "group flex w-full rounded-lg border transition-all",
        "p-3 pr-4",
        "hover:bg-accent hover:text-accent-foreground",
        completed
          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          : "border-border bg-background",
        isActive &&
          !completed &&
          "bg-primary/10 dark:bg-primary/20 border-primary/50 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary-foreground"
      )}
    >
      {/* Left: icon + text */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={cn(
            "size-6 rounded-md flex items-center justify-center shrink-0 transition",
            completed
              ? "bg-green-600 text-white"
              : "border border-border bg-background text-muted-foreground",
            isActive
              ? "border-primary bg-primary/10 dark:bg-primary/20"
              : "border-muted-foreground/60"
          )}
        >
          {completed ? (
            <Check className="size-3.5" />
          ) : lesson.lessonType === "PDF" ? (
            <FileText className="size-3.5 fill-current" />
          ) : (
            <Play
              className={cn(
                "size-3.5 fill-current",
                isActive ? "text-muted-foreground" : ""
              )}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm font-medium truncate",
              completed
                ? "text-green-800 dark:text-green-200"
                : "text-foreground"
            )}
          >
            {lesson.position}. {lesson.title}
          </p>
          {/* Video duration or PDF label */}
          {!completed && (
            <p className="text-[10px] text-muted-foreground mt-1">
              {lesson.lessonType === "PDF"
                ? "PDF"
                : lesson.lessonType === "VIDEO"
                ? `VIDEO ${lesson.videoDuration || ""}`
                : ""}
            </p>
          )}

          {completed && (
            <p className="text-[10px] text-green-700 dark:text-green-300 font-medium">
              Completed
            </p>
          )}
        </div>
      </div>

      {/* Right: currently watching */}
      {isActive && !completed && (
        <div className="flex items-center ml-2">
          <p className="text-[10px] text-primary font-medium whitespace-nowrap">
            Currently Watching
          </p>
        </div>
      )}
    </Link>
  );
}
