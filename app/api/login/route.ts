import { NextResponse } from "next/server";
import { PrismaClient } from "../../../lib/generated/prisma"; 
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.password !== password) return NextResponse.json({ error: "Invalid password" }, { status: 401 });

    return NextResponse.json({ message: "Login successful!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error, please try again later" }, { status: 500 });
  }
}
