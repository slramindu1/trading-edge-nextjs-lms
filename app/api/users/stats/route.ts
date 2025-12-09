// app/api/users/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const total = await prisma.user.count({
      where: { user_type_id: { not: 1 } } // exclude admins
    });

    const active = await prisma.user.count({
      where: { status_id: 1, user_type_id: { not: 1 } } // exclude admins
    });

    const pending = await prisma.user.count({
      where: { status_id: 3, user_type_id: { not: 1 } } // exclude admins
    });

    return NextResponse.json({ total, active, pending });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ total: 0, active: 0, pending: 0 }, { status: 500 });
  }
}
