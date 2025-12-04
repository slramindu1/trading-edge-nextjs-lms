import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ShareRedirectPage({ params }: any) {
  const { lessonId } = params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      chapter: {
        include: {
          section: true, // <-- this gives the course
        },
      },
    },
  });

  if (!lesson) {
    redirect("/404");
  }

  // Extract correct IDs
  const chapterId = lesson.chapter.id;
  const courseId = lesson.chapter.section.id; // <-- THIS IS THE REAL courseId

  // Redirect student to lesson page
  redirect(`/student/courses/${courseId}/${chapterId}/${lesson.id}`);
}
