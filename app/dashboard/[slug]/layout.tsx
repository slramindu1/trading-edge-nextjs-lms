import { ReactNode } from "react";
import { CourseSidebar } from "../_components/CourseSidebar";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { requireUser } from "@/app/data/user/require-user";

interface iAppProps {
  params: { slug: string }; // Promise wrapper removed
  children: ReactNode;
}

export default async function CourseLayout({ children, params }: iAppProps) {
  // 🔹 Ensure user is logged in
  const session = await requireUser(); // returns session with user.id
  const { slug } = params;

  // 🔹 Fetch course sidebar data with userId
  const courseData = await getCourseSidebarData(slug, session.user.id);

  return (
    <div className="flex flex-1">
      <div className="w-90 border-r border-border shrink-0">
        <CourseSidebar course={courseData.course} />
      </div>

      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
