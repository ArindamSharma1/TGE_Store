const email = "admin3@medusa-test.com";
const password = "password123";
const BACKEND_URL = "http://localhost:9000";

async function main() {
    console.log("🧪 Testing Direct Registration...");

    // Try Admin Scope first (Most likely what we need)
    console.log(`\n1. POST /admin/auth/emailpass/register`);
    try {
        const res = await fetch(`${BACKEND_URL}/admin/auth/emailpass/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        console.log(`   Status: ${res.status}`);
        if (res.ok) {
            console.log("   ✅ Success!");
            const data = await res.json();
            console.log("   Token:", data.token || data.access_token);
            return;
        } else {
            console.log("   Response:", await res.text());
        }
    } catch (e) { console.log("   Error:", e.message); }

    // Try Admin Actor Scope (Structure matches logs)
    console.log(`\n2. POST /auth/admin/emailpass/register`);
    try {
        const res = await fetch(`${BACKEND_URL}/auth/admin/emailpass/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        console.log(`   Status: ${res.status}`);
        if (res.ok) {
            console.log("   ✅ Success!");
            const data = await res.json();
            console.log("   Token:", data.token || data.access_token);
            return;
        } else {
            console.log("   Response:", await res.text());
        }
    } catch (e) { console.log("   Error:", e.message); }

    // Try User Scope (User suggestion)
    console.log(`\n3. POST /auth/user/emailpass/register`);
    try {
        const res = await fetch(`${BACKEND_URL}/auth/user/emailpass/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        console.log(`   Status: ${res.status}`);
        if (res.ok) {
            console.log("   ✅ Success!");
            const data = await res.json();
            console.log("   Token:", data.token || data.access_token);
            return;
        } else {
            console.log("   Response:", await res.text());
        }
    } catch (e) { console.log("   Error:", e.message); }

}

main();
