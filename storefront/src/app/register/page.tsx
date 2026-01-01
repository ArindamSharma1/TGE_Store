"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    // Mock error state for demonstration - in real app this comes from validation
    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-zinc-50">
            <GlassCard className="w-full max-w-md p-8 md:p-12 bg-white/80 backdrop-blur-xl border-zinc-200 shadow-xl rounded-3xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-2">
                        Create Account
                    </h1>
                    {/* Neutralised Copy */}
                    <p className="text-zinc-500">
                        Please enter your details to register.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
                            Full Name
                        </label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            className="h-12 rounded-lg border-zinc-200 focus:border-zinc-900 bg-white"
                        />
                    </div>

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
                        <label htmlFor="password" className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
                            Password
                        </label>
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
                        {errors.password ? (
                            <p className="text-xs text-red-500 font-medium">{errors.password}</p>
                        ) : (
                            <p className="text-xs text-zinc-400">Must be at least 8 characters.</p>
                        )}
                    </div>

                    <Button className="w-full h-14 rounded-full text-base font-bold bg-zinc-900 hover:bg-zinc-800 text-white mt-4">
                        Create Account
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
                    <p className="text-zinc-500 text-sm">
                        Already have an account?{" "}
                        {/* Cleaner Secondary CTA */}
                        <Link href="/login" className="font-bold text-zinc-900 hover:underline underline-offset-4 decoration-zinc-300">
                            Log In
                        </Link>
                    </p>
                </div>
            </GlassCard>
        </div>
    );
}
