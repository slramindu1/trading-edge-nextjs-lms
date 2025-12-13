"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const handleLogin = async () => {
    // Reset errors
    setErrors({});

    // Validation
    const newErrors: { email?: string; password?: string } = {};

    if (!email) newErrors.email = "Please enter the email address";
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) newErrors.email = "Invalid email address";
    }

    if (!password) newErrors.password = "Please enter the password";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log("Login API Response:", data); // Debug log

      if (res.ok) {
        toast.success("Login Successful!");

        // Small delay to show success message
        setTimeout(() => {
          // 🔹 FIXED: Check the correct response structure
          // The user data is inside data.user object
          const userTypeId = data.user?.user_type_id;
          console.log("User Type ID:", userTypeId); // Debug log
          
          // 🔹 Priority: 1. Redirect URL from query param, 2. Based on user type
          if (redirectUrl) {
            console.log("Redirecting to query param URL:", redirectUrl);
            window.location.href = redirectUrl;
          } else if (userTypeId === 1) {
            console.log("Redirecting to admin dashboard");
            window.location.href = "/admin";
          } else if (userTypeId === 2) {
            console.log("Redirecting to user dashboard");
            window.location.href = "/dashboard";
          } else {
            console.log("Redirecting to fallback");
            window.location.href = "/not-user";
          }
        }, 500);
      } else {
        // Handle specific error cases
        if (data.error === "Account is blocked. Please contact support.") {
          toast.error(
            "Your account has been blocked. Please contact support.",
            {
              duration: 5000,
              icon: <AlertCircle className="h-4 w-4" />,
            }
          );
        } else if (data.error === "Account is pending approval. Please wait for admin approval.") {
          toast.warning(
            "Your account is pending approval. Please wait for admin approval.",
            {
              duration: 5000,
              icon: <AlertCircle className="h-4 w-4" />,
            }
          );
        } else {
          toast.error(data.error || "Login Failed");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Welcome back!</CardTitle>
        <CardDescription>Login with your email account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="m@example.com"
            disabled={isLoading}
            className={
              errors.email
                ? "border-destructive focus:border-destructive focus:ring-destructive"
                : ""
            }
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2 relative">
          <Label>Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="******"
              disabled={isLoading}
              className={
                errors.password
                  ? "border-destructive focus:border-destructive focus:ring-destructive pr-10"
                  : "pr-10"
              }
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        <div className="flex justify-end">
          <a
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot Password?
          </a>
        </div>

        <Button
          onClick={handleLogin}
          disabled={isLoading}
          className="hover:cursor-pointer w-full"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}