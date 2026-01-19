import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 h-full w-full">
                <Image
                    src="/auth-bg.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                    unoptimized // Bypass Next.js optimization to serve original file quality
                />
            </div>

            {/* Content Wrapper */}
            <div className="relative z-10 w-full flex items-center justify-center p-4">
                {children}
            </div>
        </div>
    );
}
