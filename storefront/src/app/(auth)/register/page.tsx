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
import { createCustomerMutation } from "@/lib/shopify/mutations";

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
                toast.success("Account created successfully. Please sign in.");
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
                        required
                    />
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
                        required
                    />
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
                            required
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
