import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Play } from "lucide-react";
import Link from "next/link";

interface iAppProps {
  lesson: {
    id: string;
    title: string;
    position: number;
    description: string | null;
  };
  slug: string;
  isActive?:boolean;
  completed:boolean
}

export function LessonItem({ lesson, slug, isActive,completed}: iAppProps) {

  return (
    <Link
      href={`/dashboard/${slug}/${lesson.id}`}
      className={cn(
        "group flex w-full rounded-lg border transition-all",
        "p-3 pr-4", // better height & comfortable touch area
        "hover:bg-accent hover:text-accent-foreground",

        completed
          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          : "border-border bg-background",
          
          isActive && !completed && 'bg-primary/10 dark:bg-primary/20 border-primary/50 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary-foreground'
      )}
    >
      <div className="flex items-center gap-3 w-full min-w-0">
        
        {/* ICON */}
        <div
          className={cn(
            "size-6 rounded-md flex items-center justify-center shrink-0 transition",
            completed
              ? "bg-green-600 text-white"
              : "border border-border bg-background text-muted-foreground",isActive ? 'border-primary bg-primary/10 dark:bg-primary/20':'border-muted-foreground/60'
          )}
        >
          {completed ? (
            <Check className="size-3.5" />
          ) : (
            <Play className={cn("size-3.5 fill-current", isActive ? 'text-muted-foreground' : '')} />
          )}
        </div>

        {/* TEXT */}
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

          {completed && (
            <p className="text-[10px] text-green-700 dark:text-green-300 font-medium ">
              Completed
            </p>
          )}
          {isActive && !completed && <p className="text-[10px] text-primary font-medium">Currently Watching</p>}
        </div>
      </div>
    </Link>
  );
}
