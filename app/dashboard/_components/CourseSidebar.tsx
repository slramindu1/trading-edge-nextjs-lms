"use client";
import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, Play } from "lucide-react";
import { LessonItem } from "./LessonItem";
import { usePathname } from "next/navigation";
import { useCourseProgress } from "@/hooks/use-course-progress";

interface iAppProps {
  course: CourseSidebarDataType["course"];
}

export function CourseSidebar({ course }: iAppProps) {
  const pathname = usePathname();
  const currentLessonId = pathname.split("/").pop();

  const { completedLessons, progressPercentage, totalLessons } =
    useCourseProgress({ courseData: course });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pb-4 pr-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Play className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-base leading-tight truncate">
              {course.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              Forex Trading
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {completedLessons}/{totalLessons} Lessons
            </span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground">
            {progressPercentage}% Complete
          </p>
        </div>
      </div>

      {/* Chapters → Topics → Lessons */}
      <div className="py-4 pr-2 space-y-3">
        {course.chapters.map((chapter, chIndex) => (
          <Collapsible key={chapter.id} defaultOpen={chIndex === 0}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 p-3 h-auto text-left"
              >
                <ChevronDown className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {chapter.position}. {chapter.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {chapter.topics.reduce(
                      (acc, t) => acc + t.lessons.length,
                      0
                    )}{" "}
                    Lessons
                  </p>
                </div>
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-2 pl-4 border-l-2 space-y-2">
              {/* --- FILTER TOPICS: show only ones with lessons --- */}
              {chapter.topics
                .filter((topic) => topic.lessons.length > 0)
                .map((topic) => (
                  <Collapsible key={topic.id} defaultOpen={true}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full flex items-center gap-2 p-3 h-auto text-left"
                      >
                        <ChevronDown className="w-4 h-4 text-primary" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-foreground truncate">
                            {topic.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-medium">
                            {topic.lessons.length} Lessons
                          </p>
                        </div>
                      </Button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="mt-1 pl-4 space-y-1">
                      {topic.lessons.map((lesson) => (
                        <LessonItem
                          key={lesson.id}
                          lesson={lesson}
                          slug={course.slug}
                          chapterId={chapter.id}
                          isActive={currentLessonId === lesson.id}
                          completed={
                            lesson.LessonProgress.find(
                              (p) => p.LessonId === lesson.id
                            )?.completed || false
                          }
                        />
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
