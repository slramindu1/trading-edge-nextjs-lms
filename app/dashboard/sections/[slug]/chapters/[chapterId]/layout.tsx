import { ReactNode } from "react";
import { CourseSidebar } from "../../../../_components/CourseSidebar";
import { getChapterData } from "@/app/data/course/get-chapter-data";

interface iAppProps {
  params: { slug: string; chapterId: string };
  children: ReactNode;
}

export default async function ChapterLayout({ children, params }: iAppProps) {
  const { chapterId } = params;
  const chapter = await getChapterData(chapterId);

  if (!chapter) return <div>Chapter Not Found</div>;

  return (
    <div className="flex flex-1">
      <div className="w-90 border-r border-border shrink-0">
        {/* Sidebar can show current chapter only */}
        <CourseSidebar
          course={{
            id: chapter.section.id,
            title: chapter.section.title,
            fileKey: "", // optional, default empty string
            slug: chapter.section.slug,
            chapters: [
              {
                id: chapter.id,
                title: chapter.title,
                position: chapter.position,
                lessons: chapter.lessons,
              },
            ],
          }}
        />
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
