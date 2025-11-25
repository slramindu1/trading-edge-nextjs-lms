import { EmptyState } from "@/components/general/EmptyState";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import { getAllCourses } from "../data/course/get-all-courses";
import { CourseProgressCard } from "@/app/dashboard/_components/CourseProgressCard";
import Link from "next/link";

export default async function DashboardPage() {
  // Fetch all courses + enrolled data in parallel
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);

  return (
    <>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">Enrolled Sections</h1>
        <p className="text-muted-foreground">
          Here you can see all the courses you have access to
        </p>
      </div>

      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="No Courses Purchased"
          description="You have not purchased any courses yet"
          buttonText="Contact Admin"
          href="https://wa.me/94776768597"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {enrolledCourses.flatMap((user) =>
            user.enrollments.map((enrollment) => (
              <CourseProgressCard
                key={enrollment.section.id}
                data={enrollment.section}
              />
            ))
          )}
        </div>
      )}
    </>
  );
}
