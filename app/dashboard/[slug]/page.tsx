import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { requireUser } from "@/app/data/user/require-user";
import { redirect } from "next/navigation";

interface iAppProps {
  params: { slug: string };
}

export default async function CourseSlugRoute({ params }: iAppProps) {
  const session = await requireUser();
  const { slug } = params;

  const courseData = await getCourseSidebarData(slug, session.user.id);

  const firstChapter = courseData.course?.chapters?.[0];
  const firstLesson = firstChapter?.lessons?.[0];

  if (firstLesson) {
    // 🔹 Use backticks for template literal
    redirect(`/dashboard/${slug}/${firstLesson.id}`);
  }

  return (
    <div className="flex items-center justify-center h-full text-center">
      <h2 className="text-2xl font-bold mb-2">No Lessons Available</h2>
      <p className="text-muted-foreground">
        This Course Does Not Have any Lessons Yet
      </p>
    </div>
  );
}
