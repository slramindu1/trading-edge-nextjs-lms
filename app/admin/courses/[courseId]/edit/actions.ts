"use server";

import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { SectionSchema, SectionSchemaType } from "@/lib/zodSchemas";

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
        id: sectionId ,

      },
      data:{
        ...result.data,
      }
    });

return{
    status:"success",
    message:"course Updated Succesfully",
}


  } catch {
    return{
        status:'error',
        message:"failed to update course"
    }
  }
}
