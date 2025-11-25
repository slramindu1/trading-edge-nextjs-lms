"use server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "./require-user";

export async function getEnrolledCourses() {
  const user = await requireUser();

  const data = await prisma.user.findMany({
    where: {
      id: user.user.id,
    },
    select: {
      id: true,
      fname: true,
      lname: true,
      email: true,
      enrollments: {
        orderBy:{
          id:"desc"
        },  
        select: {
          section: {
            select: {
              id: true,
              title: true,
              smallDescription: true,
              fileKey: true,
              slug: true,

              chapters: {
                select: {
                  id: true,
                  title: true,
                  position: true,
                  lessons: {
                    select: {
                      id: true,
                      title: true,
                      position: true,
                      thumbnailUrl: true,
                      videoUrl: true,
                      LessonProgress: {
                        where: { userId: user.user.id },
                        select: {
                          LessonId: true,
                          completed: true,
                        },
                      },
                    },
                    orderBy: { position: "asc" },
                  },
                },
                orderBy: { position: "asc" },
              },
            },
          },
        },
      },
    },
  });

  return data;
}


export type EnrolledCourseType = Awaited<
  ReturnType<typeof getEnrolledCourses>
>[0];
