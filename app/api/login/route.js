import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ message: "Email And Password Is Required" }), { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
  }

  // ⚠️ Hashing නැතුව plain text verify
  if (user.password !== password) {
    return new Response(JSON.stringify({ message: "Password Invalid" }), { status: 401 });
  }

  return new Response(JSON.stringify({ message: "Login Successfull" }), { status: 200 });
}
