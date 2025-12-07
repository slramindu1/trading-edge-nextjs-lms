import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import "server-only";

export async function getCourseSidebarData(slug: string, userId: string) {
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
          topics: {                // <-- Load topics
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              position: true,
              lessons: {           // <-- Load lessons under topic
                orderBy: { position: "asc" },
                select: {
                  id: true,
                  title: true,
                  description: true,
                  position: true,
                  LessonProgress: {
                    where: { userId },
                    select: {
                      completed: true,
                      LessonId: true,
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) return notFound();

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId, sectionId: course.id },
  });

  if (!enrollment) return notFound();

  return { course };
}

export type CourseSidebarDataType = Awaited<ReturnType<typeof getCourseSidebarData>>;
