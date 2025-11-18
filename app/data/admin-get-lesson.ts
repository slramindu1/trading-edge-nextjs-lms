import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function adminGetLesson(id: string) {
  const data = await prisma.lesson.findUnique({
    where: {
      id: id,   // ← FIXED
    },
    select: {
      title: true,
      videoUrl: true,
      thumbnailUrl: true,
      description: true,
      id: true,
      position: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>;
