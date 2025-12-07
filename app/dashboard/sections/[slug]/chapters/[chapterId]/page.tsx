import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { requireUser } from "@/app/data/user/require-user";
import { redirect } from "next/navigation";

interface iAppProps {
  params: Promise<{ slug: string; chapterId: string }>;
}

export default async function CourseSlugRoute({ params }: iAppProps) {
  const { slug, chapterId } = await params; // await first
  const session = await requireUser();

  const courseData = await getCourseSidebarData(slug, session.user.id);

  // Find the current chapter by chapterId
  const currentChapter = courseData.course?.chapters.find(
    (c) => c.id === chapterId
  );

  // 🔹 Only get lessons from topics that have lessons
  const lessons = currentChapter?.topics
    .filter((t) => t.lessons.length > 0)
    .flatMap((t) => t.lessons);

  const firstLesson = lessons?.[0];

  if (firstLesson) {
    // Redirect to the first lesson of this chapter
    redirect(
      `/dashboard/sections/${slug}/chapters/${chapterId}/${firstLesson.id}`
    );
  }

  return (
    <div className="flex items-center justify-center h-full text-center">
      <h2 className="text-2xl font-bold mb-2">No Lessons Available</h2>
      <p className="text-muted-foreground">
        This Chapter Does Not Have any Lessons Yet
      </p>
    </div>
  );
}
