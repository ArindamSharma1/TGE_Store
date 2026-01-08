"use client";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900 mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-zinc-500 text-lg">
                        How we collect, use, and protect your data.
                    </p>
                </div>

                <div className="prose prose-zinc max-w-none text-zinc-600 space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-4">1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us, such as when you create an account, update your profile, make a purchase, or communicate with us. This information may include your name, email address, phone number, shipping address, and payment information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-4">2. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li>Process your orders and payments.</li>
                            <li>Communicate with you about your account and orders.</li>
                            <li>Send you newsletters and promotional materials (you can opt-out at any time).</li>
                            <li>Improve our website and customer service.</li>
                            <li>Detect and prevent fraud.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-4">3. Data Security</h2>
                        <p>
                            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. However, no internet transmission is ever fully secure or error-free.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-4">4. Sharing of Information</h2>
                        <p>
                            We do not sell your personal information. We may share your information with third-party vendors who perform services on our behalf, such as payment processing, shipping, and email delivery.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-4">5. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at storetge@gmail.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
