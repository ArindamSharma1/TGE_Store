const BACKEND_URL = "http://localhost:9000";
const PUBLISHABLE_KEY = "pk_92932433455c59ad80b7c71deeab97d0c9cfc0cf7b97a1a1d1e9013d9b4ae94f";

async function testFlow() {
    const email = `debug_${Date.now()}@test.com`;
    const password = "password123";
    let cookie = "";

    console.log(`\n--- Testing with ${email} ---`);

    // 1. Register Identity
    console.log("\n1. Registering Identity...");
    const regRes = await fetch(`${BACKEND_URL}/auth/customer/emailpass/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": PUBLISHABLE_KEY,
            "Origin": "http://localhost:3000"
        },
        body: JSON.stringify({ email, password, first_name: "Debug", last_name: "User" })
    });
    console.log(`Register Status: ${regRes.status}`);
    if (!regRes.ok) console.log(await regRes.text());

    // 2. Login
    console.log("\n2. Logging in...");
    const loginRes = await fetch(`${BACKEND_URL}/auth/customer/emailpass`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": PUBLISHABLE_KEY,
            "Origin": "http://localhost:3000"
        },
        body: JSON.stringify({ email, password })
    });
    console.log(`Login Status: ${loginRes.status}`);

    // Capture cookie
    const rawCookie = loginRes.headers.get("set-cookie");
    if (rawCookie) {
        // Extract connect.sid
        cookie = rawCookie.split(';')[0];
        console.log(`Cookie acquired: ${cookie}`);
    } else {
        console.log("No cookie received!");
    }

    if (!cookie) {
        console.error("CRITICAL: Login successful but no cookie returned. Origin/CORS issue likely.");
        return;
    }

    // 3. Create Customer (Linked to Session)
    console.log("\n3. Creating Customer...");
    const createRes = await fetch(`${BACKEND_URL}/store/customers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": PUBLISHABLE_KEY,
            "Cookie": cookie,
            "Origin": "http://localhost:3000"
        },
        body: JSON.stringify({ email, first_name: "Debug", last_name: "User" })
    });
    console.log(`Create Customer Status: ${createRes.status}`);
    const createBody = await createRes.json();
    console.log(JSON.stringify(createBody, null, 2));


    // 4. Check /store/customers/me
    console.log("\n4. Checking /store/customers/me...");
    const meRes = await fetch(`${BACKEND_URL}/store/customers/me`, {
        headers: {
            "x-publishable-api-key": PUBLISHABLE_KEY,
            "Cookie": cookie,
            "Origin": "http://localhost:3000"
        }
    });
    console.log(`Me Status: ${meRes.status}`);

    if (meRes.status === 200) {
        const meBody = await meRes.json();
        console.log("Me Body (Customer Found!):", JSON.stringify(meBody, null, 2));
    } else {
        console.log("Me Failed. Status:", meRes.status);
    }
}

testFlow();
