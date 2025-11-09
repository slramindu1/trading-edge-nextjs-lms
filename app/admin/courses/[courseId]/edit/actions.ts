"use server";

import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { SectionSchema, SectionSchemaType } from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";

export async function editCourse(
  data: SectionSchemaType,
  sectionId: string
): Promise<ApiResponse> {
  try {
    const result = SectionSchema.safeParse(data);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.section.update({
      where: {
        id: sectionId,
      },
      data: {
        ...result.data,
      },
    });

    return {
      status: "success",
      message: "course Updated Succesfully",
    };
  } catch {
    return {
      status: "error",
      message: "failed to update course",
    };
  }
}

export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponse> {
  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "No lessons to reorder",
      };
    }
    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: { id: lesson.id, chapterId: chapterId },
        data: { position: lesson.position },
      })
    );

    await prisma.$transaction(updates);
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Lessons reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "failed to reorder lessons",
    };
  }
}

export async function reorderChapters(
  courseId: string,
  chapters: { id: string; position: number }[]
): Promise<ApiResponse> {
  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "No chapters to reorder",
      };
    }

    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: { id: chapter.id },
        data: { position: chapter.position, sectionId: courseId },
      })
    );

    await prisma.$transaction(updates);
    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapters reordered successfully",
    };
  } catch (error) {
    console.error("Failed to reorder chapters:", error);
    return {
      status: "error",
      message: "Failed to reorder chapters",
    };
  }
}
