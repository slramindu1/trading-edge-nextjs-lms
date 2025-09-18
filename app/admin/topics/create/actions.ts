"use server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { SectionSchema, SectionSchemaType } from "@/lib/zodSchemas";

export async function CreateCourse(data: SectionSchemaType):Promise<ApiResponse> {
  const validation = SectionSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("Something Failed");
  }

  try {
     await prisma.section.create({
      data: {
        ...validation.data,
      },
    });

    return { status: "success", message: "Course Created Successfully" };
  } catch (err) {
    console.error(err);
    return { status: "error", message: "Failed To Create Course" };
  }
}
