"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { medusaClient } from "@/lib/medusa/client";

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
            const nameParts = name.trim().split(" ");
            const first_name = nameParts[0];
            const last_name = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

            // 1. Get registration token
            const token = await medusaClient.auth.register("customer", "emailpass", {
                email,
                password
            });

            // 2. Create customer using the token
            await medusaClient.store.customer.create({
                email,
                first_name,
                last_name
            }, {}, {
                Authorization: `Bearer ${token}`
            });

            // 3. Login to ensure session/token is set for future requests
            await medusaClient.auth.login("customer", "emailpass", {
                email,
                password
            });

            // Redirect to home or account
            router.push("/");
            router.refresh();

        } catch (error: any) {
            console.error("Registration error:", error);
            let errorMessage = "Registration failed. Please try again.";

            if (error.response?.data?.type === "duplicate_error") {
                errorMessage = "User with this email already exists.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            setErrors(prev => ({
                ...prev,
                general: errorMessage
            }));
        } finally {
            setIsLoading(false);
        }
    };

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

                <form className="space-y-6" onSubmit={handleRegister}>
                    {errors.general && (
                        <div className="p-3 bg-red-50 text-red-500 text-sm font-medium rounded-lg">
                            {errors.general}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
                            Full Name
                        </label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            className={cn(
                                "h-12 rounded-lg border-zinc-200 focus:border-zinc-900 bg-white",
                                errors.name && "border-red-500 focus:border-red-500"
                            )}
                            disabled={isLoading}
                        />
                        {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
                            Email
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            className={cn(
                                "h-12 rounded-lg border-zinc-200 focus:border-zinc-900 bg-white",
                                errors.email && "border-red-500 focus:border-red-500"
                            )}
                            disabled={isLoading}
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
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className={cn(
                                    "h-12 rounded-lg border-zinc-200 focus:border-zinc-900 bg-white pr-10",
                                    errors.password && "border-red-500 focus:border-red-500"
                                )}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
                                disabled={isLoading}
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

                    <Button
                        type="submit"
                        className="w-full h-14 rounded-full text-base font-bold bg-zinc-900 hover:bg-zinc-800 text-white mt-4"
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
