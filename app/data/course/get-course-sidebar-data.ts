import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import "server-only";

export async function getCourseSidebarData(slug: string, userId: string) {

  // 1. Load course/section with chapters & lessons
  const course = await prisma.section.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      fileKey: true,
      slug: true,
      chapters: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              position: true,
              description: true,
              LessonProgress:{
                where:{
                  userId:userId,
                },
                select:{
                  completed:true,
                  LessonId:true,
                  id:true
                }
              }
            },
          },
        },
      },
    },
  });

  if (!course) {
    return notFound(); // slug invalid
  }

  // 2. Check if user is enrolled in this section
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: userId,
      sectionId: course.id,
    },
  });

  if (!enrollment) {
    // User trying to access without purchase
    return notFound();
  }

  // 3. Return full sidebar data including enroll state
  return {
    course,
  };
}

export type CourseSidebarDataType = Awaited<ReturnType<typeof getCourseSidebarData>>
