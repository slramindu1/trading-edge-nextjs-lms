"use server";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function adminGetChapter(chapterId: string) {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    select: {
      id: true,
      title: true,
      description: true,
      smallDescription: true,
      fileKey: true,
      sectionId: true,
    },
  });

  if (!chapter) throw new Error("Chapter not found");

  return {
    id: chapter.id,
    name: chapter.title,
    description: chapter.description,
    smallDescription: chapter.smallDescription,
    fileKey: chapter.fileKey,      // <-- FIXED
    courseId: chapter.sectionId,
  };
}


export type AdminChapterSingularType = Awaited<
  ReturnType<typeof adminGetChapter>
>;
