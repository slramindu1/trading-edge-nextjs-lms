import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const isPublicPath = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/api/login",
    "/api/register",
  ].some(publicPath => path.startsWith(publicPath));

  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!isPublicPath && !token) {
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(redirectUrl);
  }

  if (isPublicPath && token && !path.startsWith("/api/")) {
    // Removed the try-catch since we're not actually verifying the token
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml).*)",
  ],
};