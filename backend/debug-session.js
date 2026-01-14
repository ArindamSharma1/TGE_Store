const fetch = require('node-fetch'); // Ensure node-fetch is available or use native fetch in Node 18+

const BACKEND_URL = "http://localhost:9000";
const EMAIL = "test" + Date.now() + "@example.com";
const PASSWORD = "password123";
const PUB_KEY = "pk_fe5c9a3efe63600ecd8e5442857f33d665324907e9ed7e60449d5647d1a0e5df";

async function run() {
    console.log(`1. Registering user: ${EMAIL}`);
    const registerRes = await fetch(`${BACKEND_URL}/auth/customer/emailpass/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: EMAIL,
            password: PASSWORD,
            first_name: "Test",
            last_name: "User"
        })
    });

    if (!registerRes.ok) {
        console.error("Registration failed:", registerRes.status, await registerRes.text());
        return;
    }
    console.log("Registration successful.");

    console.log("2. Logging in...");
    const loginRes = await fetch(`${BACKEND_URL}/auth/customer/emailpass`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Origin": "http://localhost:3000",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
            "x-publishable-api-key": PUB_KEY
        },
        body: JSON.stringify({
            email: EMAIL,
            password: PASSWORD
        })
    });

    if (!loginRes.ok) {
        console.error("Login failed:", loginRes.status, await loginRes.text());
        return;
    }

    console.log("Login successful.");
    const body = await loginRes.json();
    console.log("Response Body:", JSON.stringify(body, null, 2));
    console.log("Response Body:", JSON.stringify(body, null, 2));
    // console.log("Headers:", JSON.stringify([...loginRes.headers.entries()]));
    if (!body.token) {
        console.error("CRITICAL: No token in login response!");
        return;
    }

    console.log("2b. Exchanging Token for Session (Cookie)...");
    const sessionRes = await fetch(`${BACKEND_URL}/auth/session`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${body.token}`,
            "x-publishable-api-key": PUB_KEY
        }
    });

    if (!sessionRes.ok) {
        console.error("Session exchange failed:", sessionRes.status, await sessionRes.text());
        return;
    }

    console.log("Session exchange successful.");
    const sessionBody = await sessionRes.json();
    console.log("Session Response Body:", JSON.stringify(sessionBody, null, 2));
    console.log("Session Headers:", JSON.stringify([...sessionRes.headers.entries()]));

    // Now we should have the cookie
    const cookies = sessionRes.headers.get("set-cookie");
    console.log("Exchange Set-Cookie:", cookies);

    if (!cookies || !cookies.includes("connect.sid")) {
        console.error("CRITICAL: No connect.sid cookie found even after exchange!");
        return;
    }

    // Parse cookie to get just the name=value part
    const cookieValue = cookies.split(';')[0];
    console.log("Parsed Cookie for Request:", cookieValue);

    console.log("3. Fetching Customer (Me) with Cookie...");
    const meRes = await fetch(`${BACKEND_URL}/store/customers/me`, {
        method: "GET",
        headers: {
            "Cookie": cookieValue,
            "x-publishable-api-key": PUB_KEY
        }
    });

    if (!meRes.ok) {
        console.error("Fetch Me failed:", meRes.status, await meRes.text());
        return;
    }

    const meData = await meRes.json();
    console.log("Fetch Me successful. Customer Email:", meData.customer.email);
}

run().catch(console.error);
