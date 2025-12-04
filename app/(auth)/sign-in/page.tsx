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
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard"; // Default redirect if no query

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const handleLogin = async () => {
    const newErrors: { email?: string; password?: string } = {};
    setErrors({}); // clear previous errors

    // Validation
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

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login Successful!");

        // 🔹 Redirect based on redirect query param
        window.location.href = redirectUrl;
      } else {
        toast.error(data.error || "Login Failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error, Please Try Again Later");
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
            placeholder="m@example.com"
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
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="******"
            className={
              errors.password
                ? "border-destructive focus:border-destructive focus:ring-destructive"
                : ""
            }
          />
          <button
            type="button"
            className="absolute right-2 top-13/20 -translate-y-1/2 text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
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

        <Button onClick={handleLogin} className="hover:cursor-pointer w-full">
          Login
        </Button>
      </CardContent>
    </Card>
  );
}
