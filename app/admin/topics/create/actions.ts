"use server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import { SectionSchema, SectionSchemaType } from "@/lib/zodSchemas";

export async function CreateCourse(
  data: SectionSchemaType
): Promise<ApiResponse> {
  const validation = SectionSchema.safeParse(data);
  if (!validation.success) {
    return { status: "error", message: "Invalid Data" };
  }

  try {
    await prisma.$transaction(async (tx) => {

      // 1️⃣ Create section
      const section = await tx.section.create({
        data: {
          ...validation.data,
        },
      });

      // 2️⃣ Get all PAID students
      const paidStudents = await tx.user.findMany({
        where: {
          student_type: "PAID",
          status_id: 1, // Access only (optional safety)
        },
        select: { id: true },
      });

      // 3️⃣ Create enrollments
      if (paidStudents.length > 0) {
        await tx.enrollment.createMany({
          data: paidStudents.map((student) => ({
            userId: student.id,
            sectionId: section.id,
          })),
          skipDuplicates: true, // 🔒 safety
        });
      }
    });

    return {
      status: "success",
      message: "Course created & enrolled PAID students successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
}
