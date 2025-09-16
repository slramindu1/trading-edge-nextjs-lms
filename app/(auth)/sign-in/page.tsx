"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GithubIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email) {
      toast.error("Please Enter The Email Address");
      return;
    }

    if (!password) {
      toast.error("Please Enter The Password");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please Enter Valid Email Address");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // 🟢 Login API call
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login Successful!");
        // Redirect to dashboard
      } else {
        toast.error(data.message || "Login Failed");
      }
    } catch (err) {
      toast.error("Server error, Please Try Again Later");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl"> Welcome back! </CardTitle>
        <CardDescription>Login with YourGithub Email Account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3">
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="m@example.com"
          />
        </div>
        <div className="grid gap-3">
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="******"
          />
        </div>
        <Button onClick={handleLogin} className="hover:cursor-pointer">
          Login
        </Button>
      </CardContent>
    </Card>
  );
}
