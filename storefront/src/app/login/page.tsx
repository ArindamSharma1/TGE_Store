"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-zinc-50">
            <GlassCard className="w-full max-w-md p-8 md:p-12 bg-white/80 backdrop-blur-xl border-zinc-200 shadow-xl rounded-3xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-zinc-500">
                        Sign in to access your orders and wishlist.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className={cn(
                                "h-12 rounded-lg border-zinc-200 focus:border-zinc-900 bg-white",
                                errors.email && "border-red-500 focus:border-red-500"
                            )}
                        />
                        {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label htmlFor="password" className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
                                Password
                            </label>
                            <Link href="/forgot-password" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:underline">
                                Forgot?
                            </Link>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className={cn(
                                    "h-12 rounded-lg border-zinc-200 focus:border-zinc-900 bg-white pr-10",
                                    errors.password && "border-red-500 focus:border-red-500"
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
                    </div>

                    <Button className="w-full h-14 rounded-full text-base font-bold bg-zinc-900 hover:bg-zinc-800 text-white mt-4">
                        Sign In
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
                    <p className="text-zinc-500 text-sm">
                        Don't have an account?{" "}
                        {/* Cleaner CTA */}
                        <Link href="/register" className="font-bold text-zinc-900 hover:underline underline-offset-4 decoration-zinc-300">
                            Create Account
                        </Link>
                    </p>
                </div>
            </GlassCard>
        </div>
    );
}
