"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { shopifyFetch } from "@/lib/shopify";
import { createCustomerAccessTokenMutation } from "@/lib/shopify/mutations";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const res = await shopifyFetch<any>({
                query: createCustomerAccessTokenMutation,
                variables: {
                    input: {
                        email,
                        password,
                    },
                },
                cache: 'no-store'
            });

            const { customerAccessToken, customerUserErrors } = res?.customerAccessTokenCreate || {};

            if (customerUserErrors && customerUserErrors.length > 0) {
                toast.error(customerUserErrors[0].message);
                return;
            }

            if (customerAccessToken?.accessToken) {
                localStorage.setItem("shopify_customer_token", customerAccessToken.accessToken);
                toast.success("Welcome back!");
                // Force reload to update Header and avoid Router hang
                window.location.href = "/account";
            } else {
                toast.error("Invalid credentials.");
            }

        } catch (error) {
            console.error("Login failed", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full max-w-md p-8 md:p-12 bg-zinc-950/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[32px] overflow-hidden group">
            {/* Noise Overlay */}
            <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.07] z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`
                }}
            />

            <div className="relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-3">
                        Welcome Back
                    </h1>
                    <p className="text-zinc-400 text-sm font-medium tracking-wide">
                        Sign in to access your orders and wishlist.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">
                            Email
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            className={cn(
                                "h-14 rounded-2xl border-white/5 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus:border-white/20 focus:bg-zinc-900 transition-all text-base px-4"
                            )}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center pl-1 pr-1">
                            <label htmlFor="password" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                Password
                            </label>
                            <Link href="/forgot-password" className="text-[10px] font-bold text-zinc-500 hover:text-white hover:underline uppercase tracking-wide">
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
                                    "h-14 rounded-2xl border-white/5 bg-zinc-900/50 text-white placeholder:text-zinc-600 pr-12 focus:border-white/20 focus:bg-zinc-900 transition-all text-base px-4"
                                )}
                                disabled={isLoading}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                                disabled={isLoading}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 rounded-full text-sm font-bold bg-white text-black hover:bg-zinc-200 mt-6 transition-transform hover:scale-[1.02]"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Signing In...
                            </div>
                        ) : (
                            "SIGN IN"
                        )}
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-zinc-500 text-xs font-medium">
                        Don't have an account?{" "}
                        <Link href="/register" className="font-bold text-white hover:underline underline-offset-4 decoration-zinc-500 ml-1">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
