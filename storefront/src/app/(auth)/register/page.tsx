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
import { createCustomerMutation, createCustomerAccessTokenMutation } from "@/lib/shopify/mutations";

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Simple Error State
    const [errors, setErrors] = useState<any>({});

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Splitting name for firstName and lastName logic
        const [firstName, ...rest] = name.split(" ");
        const lastName = rest.join(" ") || "";

        try {
            const res = await shopifyFetch<any>({
                query: createCustomerMutation,
                variables: {
                    input: {
                        firstName,
                        lastName,
                        email,
                        password
                    }
                },
                cache: 'no-store'
            });

            const { customer, customerUserErrors } = res?.customerCreate || {};

            if (customerUserErrors && customerUserErrors.length > 0) {
                toast.error(customerUserErrors[0].message);
                return;
            }

            if (customer?.id) {
                // Auto-Login
                try {
                    const loginRes = await shopifyFetch<any>({
                        query: createCustomerAccessTokenMutation,
                        variables: {
                            input: { email, password }
                        },
                        cache: 'no-store'
                    });

                    const { customerAccessToken } = loginRes?.customerAccessTokenCreate || {};

                    if (customerAccessToken?.accessToken) {
                        localStorage.setItem("shopify_customer_token", customerAccessToken.accessToken);
                        toast.success("Account created! Logging you in...");
                        // Use hard redirect to sync header
                        window.location.href = "/account";
                        return;
                    }
                } catch (err) {
                    console.error("Auto-login failed", err);
                }

                // Fallback if auto-login fails
                toast.success("Account created! Please sign in.");
                router.push("/login");
            } else {
                toast.error("Failed to create account. Please try again.");
            }

        } catch (error) {
            console.error("Registration failed", error);
            toast.error("Something went wrong.");
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
                        Create Account
                    </h1>
                    <p className="text-zinc-400 text-sm font-medium tracking-wide">
                        Join TGE. Define your uniform.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleRegister}>
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">
                            Full Name
                        </label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            className={cn(
                                "h-14 rounded-2xl border-white/5 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus:border-white/20 focus:bg-zinc-900 transition-all text-base px-4",
                                errors.name && "border-red-500/50 focus:border-red-500"
                            )}
                            disabled={isLoading}
                            required
                        />
                    </div>

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
                                "h-14 rounded-2xl border-white/5 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus:border-white/20 focus:bg-zinc-900 transition-all text-base px-4",
                                errors.email && "border-red-500/50 focus:border-red-500"
                            )}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">
                            Password
                        </label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className={cn(
                                    "h-14 rounded-2xl border-white/5 bg-zinc-900/50 text-white placeholder:text-zinc-600 pr-12 focus:border-white/20 focus:bg-zinc-900 transition-all text-base px-4",
                                    errors.password && "border-red-500/50 focus:border-red-500"
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
                                creating account...
                            </div>
                        ) : (
                            "CREATE ACCOUNT"
                        )}
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-zinc-500 text-xs font-medium">
                        Already have an account?{" "}
                        <Link href="/login" className="font-bold text-white hover:underline underline-offset-4 decoration-zinc-500 ml-1">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
