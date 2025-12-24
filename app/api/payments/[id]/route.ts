import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

// Initialize Prisma client
const prisma = new PrismaClient();

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      payment,
    });
  } catch (err) {
    console.error("Error fetching payment:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch payment" },
      { status: 500 }
    );
  }
}