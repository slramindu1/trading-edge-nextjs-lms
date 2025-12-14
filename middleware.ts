// middleware.ts - Updated with correct path
import { NextRequest, NextResponse } from "next/server";

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/complete-profile",
  "/api/login",
  "/api/users/complete-profile",
  "/api/users/profile-check", // Correct path
  "/api/logout",
  "/api/session",
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if it's a public path
  const isPublicPath = PUBLIC_PATHS.some(publicPath => 
    path.startsWith(publicPath)
  );
  
  // Get user ID from cookies (session_token contains user ID)
  const userId = request.cookies.get("session_token")?.value;
  
  // 1. Authentication check
  if (!isPublicPath && !userId) {
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If user is logged in and tries to access public auth paths, redirect to dashboard
  if (userId && isPublicPath) {
    const isAuthApiPath = path.startsWith("/api/login") || 
                         path.startsWith("/sign-in") ||
                         path.startsWith("/sign-up");
    
    if (isAuthApiPath && !path.startsWith("/api/")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  
  // 2. Profile completion check
  if (userId && !isPublicPath) {
    try {
      // Use the correct path: /api/user/users/profile-check
      const apiUrl = new URL("/api/users/profile-check", request.url);
      
      const profileResponse = await fetch(apiUrl, {
        headers: {
          Cookie: `session_token=${userId}`,
        },
      });
      
      // Check if response is JSON
      const contentType = profileResponse.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await profileResponse.json();
        
        // If profile not completed and not already on complete-profile page
        if (!data.profile_completed && !path.startsWith("/complete-profile")) {
          const redirectUrl = new URL("/complete-profile", request.url);
          redirectUrl.searchParams.set("redirect", path);
          return NextResponse.redirect(redirectUrl);
        }
        
        // If profile completed and on complete-profile page, redirect to dashboard
        if (data.profile_completed && path.startsWith("/complete-profile")) {
          const redirectTo = request.nextUrl.searchParams.get("redirect") || "/dashboard";
          return NextResponse.redirect(new URL(redirectTo, request.url));
        }
      }
    } catch (error) {
      console.error("Profile check error in middleware:", error);
      // Continue without profile check if error
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};