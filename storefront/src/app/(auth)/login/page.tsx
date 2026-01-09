"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { medusaClient } from "@/lib/medusa/client";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        general: ""
    });

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({ email: "", password: "", general: "" });

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            setErrors(prev => ({
                ...prev,
                email: !email ? "Email is required" : "",
                password: !password ? "Password is required" : ""
            }));
            setIsLoading(false);
            return;
        }

        try {
            const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

            const MSG_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_92932433455c59ad80b7c71deeab97d0c9cfc0cf7b97a1a1d1e9013d9b4ae94f";

            console.log("Logging in via cookie auth...");
            const response = await fetch(`${BACKEND_URL}/auth/customer/emailpass`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-publishable-api-key": MSG_KEY
                },
                body: JSON.stringify({
                    email,
                    password
                }),
                credentials: "include"
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Invalid email or password");
            }

            // Success - Cookie should be set by backend
            toast.success("Welcome back!", {
                description: "You have been successfully logged in."
            });

            // Force hard navigation to ensure cookies are picked up
            window.location.href = "/account";

        } catch (error: any) {
            console.error("Login Error:", error);
            setErrors(prev => ({
                ...prev,
                general: error?.message || "Invalid email or password"
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 md:p-12 bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
                    Welcome Back
                </h1>
                <p className="text-zinc-400">
                    Sign in to access your orders and wishlist.
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
                {errors.general && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-lg">
                        {errors.general}
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-zinc-200 uppercase tracking-wide">
                        Email
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        className={cn(
                            "h-12 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-white/20 focus:bg-white/10 transition-all",
                            errors.email && "border-red-500/50 focus:border-red-500"
                        )}
                        disabled={isLoading}
                    />
                    {errors.email && <p className="text-xs text-red-400 font-medium">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label htmlFor="password" className="text-sm font-bold text-zinc-200 uppercase tracking-wide">
                            Password
                        </label>
                        <Link href="/forgot-password" className="text-xs font-medium text-zinc-400 hover:text-white hover:underline">
                            Forgot?
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={cn(
                                "h-12 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-zinc-500 pr-10 focus:border-white/20 focus:bg-white/10 transition-all",
                                errors.password && "border-red-500/50 focus:border-red-500"
                            )}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                            disabled={isLoading}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-400 font-medium">{errors.password}</p>}
                </div>

                <Button
                    type="submit"
                    className="w-full h-14 rounded-full text-base font-bold bg-white text-black hover:bg-zinc-200 mt-4 transition-colors"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Signing In...
                        </div>
                    ) : (
                        "Sign In"
                    )}
                </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-zinc-500 text-sm">
                    Don't have an account?{" "}
                    <Link href="/register" className="font-bold text-white hover:underline underline-offset-4 decoration-zinc-500">
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
}
