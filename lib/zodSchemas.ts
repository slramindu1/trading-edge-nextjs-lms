import { z } from "zod";

export const courseStatus = ["Draft", "Published", "Archived"] as const;
export const SectionSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters" }),
  description: z
    .string()
    .min(1, { message: "Description must be at least 1 character long" })
    .max(500, { message: "Description must be at most 500 characters" }),
  fileKey: z.string().min(1, { message: "Thumbnail is required" }),
  slug: z.string().min(3, { message: "Slug is required" }),
  status: z.enum(courseStatus),
  smallDescription: z
    .string()
    .min(3, { message: "Small Description must be at least 3 characters" })
    .max(200, { message: "Small Description must be at most 100 characters" }),
});

export const chapterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Chapter name must be at least 3 characters long" }),
  courseId: z.uuid({ message: "Invalid Course ID" }),
  fileKey: z.string().optional(),
  description: z.string().optional(),
  smallDescription: z.string().optional(),
});

export const lessonSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Lesson title must be at least 3 characters long" }),
  sectionId: z.uuid({ message: "Invalid Course ID" }),
  chapterId: z.string().min(1, { message: "Invalid Chapter ID" }),
  description: z
    .string()
    .min(1, { message: "Description must be at least 1 character long" })
    .optional(),
  thumbnailUrl:z.string().optional(),
  videoUrl: z.string().optional(),
});

export type SectionSchemaType = z.infer<typeof SectionSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
