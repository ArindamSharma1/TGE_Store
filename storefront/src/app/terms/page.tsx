"use client";

export default function TermsPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900 mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-zinc-500 text-lg">
                        Please read these terms carefully before using our service.
                    </p>
                </div>

                <div className="prose prose-zinc max-w-none text-zinc-600 space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-4">1. Introduction</h2>
                        <p>
                            Welcome to TGE Store. By accessing our website and using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-4">2. Use License</h2>
                        <p>
                            Permission is granted to temporarily download one copy of the materials (information or software) on TGE Store's website for personal, non-commercial transitory viewing only.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-4">3. Disclaimer</h2>
                        <p>
                            The materials on TGE Store's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-4">4. Limitations</h2>
                        <p>
                            In no event shall TGE Store or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-4">5. Revisions</h2>
                        <p>
                            The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete or current.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-4">6. Governing Law</h2>
                        <p>
                            These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-4">7. Contact Information</h2>
                        <p>
                            Questions about the Terms of Service should be sent to us at storetge@gmail.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
