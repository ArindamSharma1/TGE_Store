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
// import { medusaClient } from "@/lib/medusa/client";
// import { registerAction } from "@/app/actions/auth";

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        general: ""
    });

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({ name: "", email: "", password: "", general: "" });

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Basic Validation
        let hasError = false;
        const newErrors = { name: "", email: "", password: "", general: "" };

        if (!name) {
            newErrors.name = "Full Name is required";
            hasError = true;
        }
        if (!email) {
            newErrors.email = "Email is required";
            hasError = true;
        }
        if (!password || password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
            const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

            const firstName = name.split(" ")[0];
            const lastName = name.split(" ").slice(1).join(" ") || "";

            // 1. Create customer
            const createRes = await fetch(`${BACKEND_URL}/store/customers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-publishable-api-key": PUBLISHABLE_KEY!,
                },
                body: JSON.stringify({
                    email,
                    password,
                    first_name: firstName,
                    last_name: lastName,
                }),
            });

            if (!createRes.ok) {
                const err = await createRes.json().catch(() => ({}));
                throw new Error(err.message || "Registration failed");
            }

            // 2. Login immediately
            const loginRes = await fetch(`${BACKEND_URL}/auth/customer/emailpass`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-publishable-api-key": PUBLISHABLE_KEY!,
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            if (!loginRes.ok) {
                throw new Error("Account created but automatic login failed. Please try logging in.");
            }

            const loginData = await loginRes.json();

            if (loginData.token) {
                localStorage.setItem("medusa_auth_token", loginData.token);
            }

            // Success
            toast.success("Account created successfully!", {
                description: "You have been signed in."
            });

            // Force hard navigation
            window.location.href = "/account";

        } catch (error: any) {
            console.error("Registration Error:", error);
            setErrors(prev => ({
                ...prev,
                general: error.message || "An unexpected error occurred."
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 md:p-12 bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
                    Create Account
                </h1>
                <p className="text-zinc-400">
                    Please enter your details to register.
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleRegister}>
                {errors.general && (
                    <div className={cn(
                        "p-4 text-sm rounded-xl border flex flex-col gap-2 transition-all duration-300",
                        errors.general.includes("already exists")
                            ? "bg-zinc-800/50 border-zinc-700 text-zinc-300"
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                    )}>
                        <p className="leading-relaxed">
                            {errors.general}
                        </p>
                        {errors.general.includes("already exists") && (
                            <Link
                                href="/login"
                                className="flex items-center gap-1.5 font-bold text-white hover:text-zinc-300 transition-colors self-start group"
                            >
                                <span>Sign in now</span>
                                <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                            </Link>
                        )}
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold text-zinc-200 uppercase tracking-wide">
                        Full Name
                    </label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        className={cn(
                            "h-12 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-white/20 focus:bg-white/10 transition-all",
                            errors.name && "border-red-500/50 focus:border-red-500"
                        )}
                        disabled={isLoading}
                    />
                    {errors.name && <p className="text-xs text-red-400 font-medium">{errors.name}</p>}
                </div>

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
                    <label htmlFor="password" className="text-sm font-bold text-zinc-200 uppercase tracking-wide">
                        Password
                    </label>
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
                    {errors.password ? (
                        <p className="text-xs text-red-400 font-medium">{errors.password}</p>
                    ) : (
                        <p className="text-xs text-zinc-500">Must be at least 8 characters.</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full h-14 rounded-full text-base font-bold bg-white text-black hover:bg-zinc-200 mt-4 transition-colors"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating Account...
                        </div>
                    ) : (
                        "Create Account"
                    )}
                </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-zinc-500 text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="font-bold text-white hover:underline underline-offset-4 decoration-zinc-500">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}
