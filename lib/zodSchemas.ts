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
  status: z.enum(courseStatus).default("Draft"),
  smallDescription: z.string().min(3,{message:"Small Description must be at least 3 characters"}).max(200,{message:"Small Description must be at most 100 characters"}),
});

export type SectionSchemaType = z.infer<typeof SectionSchema>;
