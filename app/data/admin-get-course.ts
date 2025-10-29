// src/app/data/admin-get-course.ts
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function adminGetCourse(id: string) {
  const data = await prisma.section.findUnique({
    where: { id },
    include: {
      chapters: {
        include: {
          lessons: true,
          
        },
      },
    },
  });

  if (!data) notFound();

  return data;
}

export type AdminCourseSingularType = Awaited<ReturnType<typeof adminGetCourse>>;
