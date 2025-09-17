import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/S3Client";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "FileName Is Required" }),
  contentType: z.string().min(1, { message: "Content Type is Required" }),
  size: z.number().min(1, { message: "Size Is Required" }),
  isImage: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid Request Body" },
        { status: 400 }
      );
    }

    const { fileName, contentType } = validation.data;
    const uniqueKey = `${uuidv4()}-${fileName}`;

    // ❌ remove ContentLength
    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES!,
      Key: uniqueKey,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3, command, {
      expiresIn: 360, // 6 mins
    });

    return NextResponse.json({
      presignedUrl,
      key: uniqueKey,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
