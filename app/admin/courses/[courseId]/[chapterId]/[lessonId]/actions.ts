"use server";

import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";

export async function updateLesson(values: LessonSchemaType,lessonId:string) : Promise<ApiResponse> {
  try {
    const result = lessonSchema.safeParse(values);
    if (!result.success) {
      return {
        status: 'error',
        message: "Invalid input data.",
      }
    }
    await prisma.lesson.update({
      where: { id:lessonId },
      data: {
        title:result.data.name,
        description:result.data.description,
        thumbnailUrl:result.data.thumbnailUrl,
        videoUrl:result.data.videoUrl,
      },
    });
    return {
        status: "success",
        message: "Lesson updated successfully.",
    }

  } catch (error) {
    return {
        status: "error",
        message: "Failed to update lesson.",
    }
  }
}
