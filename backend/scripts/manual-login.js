const email = "admin@medusa-test.com";
const password = "supersecret";
const BACKEND_URL = "http://localhost:9000";

async function main() {
    console.log("🧪 Testing Direct Login...");

    // Try Auth Module Login (not API route)
    // Endpoint: /auth/admin/emailpass (POST)
    console.log(`\n1. POST /auth/admin/emailpass`);
    try {
        const res = await fetch(`${BACKEND_URL}/auth/admin/emailpass`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": "http://localhost:9000"
            },
            body: JSON.stringify({ email, password })
        });
        console.log(`   Status: ${res.status}`);
        if (res.ok) {
            console.log("   ✅ Success!");
            const data = await res.json(); // It might return token or redirect
            console.log("   Body:", JSON.stringify(data));
            if (data.token) console.log("   Token:", data.token);
        } else {
            console.log("   Response:", await res.text());
        }
    } catch (e) { console.log("   Error:", e.message); }

    console.log(`\n2. POST /admin/auth/token`);
    try {
        const res = await fetch(`${BACKEND_URL}/admin/auth/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        console.log(`   Status: ${res.status}`);
        if (res.ok) {
            console.log("   ✅ Success!");
            const data = await res.json();
            console.log("   Token:", data.access_token);
            return;
        } else {
            console.log("   Response:", await res.text());
        }
    } catch (e) { console.log("   Error:", e.message); }
}

main();
