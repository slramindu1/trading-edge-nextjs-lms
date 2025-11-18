// app/api/upload/route.ts
export const runtime = "nodejs"; // important: we use fs, so ensure nodejs runtime

import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    // Basic validation (optional)
    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ success: false, error: "File type not allowed" }, { status: 400 });
    }

    // Ensure uploads directory exists inside public
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Save the file (file.name should be the provided filename)
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name || `upload-${Date.now()}`;
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const pathUrl = `/uploads/${fileName}`;
    // If you want full absolute url, you can build from env NEXT_PUBLIC_BASE_URL
    const base = process.env.NEXT_PUBLIC_BASE_URL || "";
    const fullUrl = base ? `${base.replace(/\/$/, "")}${pathUrl}` : pathUrl;

    return NextResponse.json({
      success: true,
      path: pathUrl,
      url: fullUrl,
      name: fileName,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
