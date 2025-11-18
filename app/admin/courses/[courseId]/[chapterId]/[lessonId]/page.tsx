import { adminGetLesson } from "@/app/data/admin-get-lesson";
import { LessonForm } from "./_components/LessonForm";


interface Params {
    courseId: string;
    chapterId: string;
    lessonId: string;
}

export default async function LessonIdPage({ params }: { params: Params }) {
    const { chapterId, courseId, lessonId } = params;
    const lesson = await adminGetLesson(lessonId);

    return (
        <LessonForm data={lesson} chapterId={chapterId}  courseId={courseId}/>
    );
}