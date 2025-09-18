import { NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 })
    }

    // Ensure uploads directory exists inside public
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await fs.mkdir(uploadDir, { recursive: true })

    // Save the file
    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = path.join(uploadDir, file.name)
    await fs.writeFile(filePath, buffer)

    return NextResponse.json({
      success: true,
      path: `/uploads/${file.name}`, // accessible via domain/uploads/...
    })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 })
  }
}
