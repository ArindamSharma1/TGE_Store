"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

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
        // Temporary Stub
        setTimeout(() => {
            toast.info("Authentication is being migrated to Shopify.");
            setIsLoading(false);
        }, 1000);
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
                            "h-12 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-white/20 focus:bg-white/10 transition-all"
                        )}
                        disabled={isLoading}
                    />
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
                                "h-12 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-zinc-500 pr-10 focus:border-white/20 focus:bg-white/10 transition-all"
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
