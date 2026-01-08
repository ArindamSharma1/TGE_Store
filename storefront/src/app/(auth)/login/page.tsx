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
            const response = await medusaClient.auth.login("customer", "emailpass", {
                email,
                password
            });

            // Medusa V2: login returns the token string directly in some configs
            // or an object { access_token: string } in others.
            // The debugging confirmed it is returning the Token String directly.

            let token: string | undefined;

            if (typeof response === "string") {
                token = response;
            } else if (typeof response === "object" && response !== null) {
                // @ts-ignore
                token = response.access_token || response.token;
            }

            if (token) {
                localStorage.setItem("medusa_auth_token", token);

                toast.success("Welcome back!", {
                    description: "You have successfully signed in."
                });

                window.location.href = "/";
            } else {
                console.error("Login failed: Unexpected response format", response);
                toast.error("Login Error", {
                    description: "Server returned an unexpected format. Please contact support."
                });
            }
        } catch (error: any) {
            // Console Hygiene: Log only in development, and use debug level
            if (process.env.NODE_ENV === "development") {
                console.debug("Login error (safe log):", {
                    message: error?.message,
                    status: error?.response?.status,
                    type: error?.response?.data?.type
                });
            }

            let errorMessage = "Invalid email or password. Please try again.";

            // Handle specific 401 Unauthorized (Wrong credentials)
            if (error?.response?.status === 401) {
                errorMessage = "The email or password you entered is incorrect.";
            } else if (error?.response?.data?.message) {
                // Use backend message if available and safe (e.g., validation)
                errorMessage = error.response.data.message;
            }

            // Check for user not found specifically if backend exposes it (Medusa typically treats this as 401 for security to prevent enumeration, but we can customize the generic message)
            // However, strictly following user request to say "email not existing", we might need to rely on 401. 
            // Ideally, Medusa returns 401 for both wrong password and user not found. 
            // We will update the generic 401 message to cover both cleanly or rely on specific types if available.

            setErrors(prev => ({
                ...prev,
                general: errorMessage
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
