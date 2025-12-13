import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log("📧 Login attempt for:", email);
    console.log("🔑 Password provided:", password);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log("👤 User found:", user ? "Yes" : "No");
    if (user) {
      console.log("📋 User details:", {
        id: user.id,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        status_id: user.status_id,
        user_type_id: user.user_type_id,
        hasPassword: !!user.password,
        passwordLength: user.password?.length || 0,
      });
    }

    if (!user) {
      console.log("❌ User not found with email:", email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user is blocked (status_id = 2)
    if (user.status_id === 2) {
      console.log("🚫 User is blocked:", user.email);
      return NextResponse.json(
        { error: "Account is blocked. Please contact support." },
        { status: 403 }
      );
    }

    // Check if user is pending (status_id = 3)
    if (user.status_id === 3) {
      console.log("⏳ User is pending:", user.email);
      return NextResponse.json(
        { error: "Account is pending approval. Please wait for admin approval." },
        { status: 403 }
      );
    }

    // Check if user has a password
    if (!user.password) {
      console.log("⚠️ User has no password set:", user.email);
      return NextResponse.json(
        { error: "No password set for this account. Please contact admin." },
        { status: 401 }
      );
    }

    // Plain text password comparison (for testing only!)
    console.log("🔍 Comparing passwords:");
    console.log("   Provided password:", password);
    console.log("   Stored password:", user.password);
    
    const isPasswordValid = password === user.password;

    console.log("✅ Password valid?", isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Set session cookie
    const cookieStore = await cookies();
    
    cookieStore.set("session_token", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    console.log("🎉 Login successful for:", user.email);

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        user_type_id: user.user_type_id,
        status_id: user.status_id,
      },
    });
  } catch (error) {
    console.error("💥 Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// For development/testing, also add GET method to test
export async function GET() {
  return NextResponse.json({
    message: "Login API is running",
    note: "Use POST method with {email, password} to login",
    warning: "This is a TEST application using plain text passwords!",
  });
}