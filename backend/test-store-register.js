const fetch = require('node-fetch');

const BACKEND_URL = "http://localhost:9000";
const PUB_KEY = "pk_fe5c9a3efe63600ecd8e5442857f33d665324907e9ed7e60449d5647d1a0e5df";
const EMAIL = "storetest" + Date.now() + "@example.com";
const PASSWORD = "password123";

async function testStoreRegister() {
    console.log(`1. Testing POST /store/customers with: ${EMAIL}`);
    const res = await fetch(`${BACKEND_URL}/store/customers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": PUB_KEY
        },
        body: JSON.stringify({
            email: EMAIL,
            password: PASSWORD,
            first_name: "Store",
            last_name: "Test",
            phone: "+1234567890", // optional usually
            company_name: "TestCorp"
        })
    });

    if (!res.ok) {
        console.error("Store Register Failed:", res.status, await res.text());
        return;
    }

    const data = await res.json();
    console.log("Store Register Success!", JSON.stringify(data, null, 2));

    // If success, try to login to verify Auth Identity was created
    console.log("\n2. Attempting Login with new credentials...");
    const loginRes = await fetch(`${BACKEND_URL}/auth/customer/emailpass`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": PUB_KEY
        },
        body: JSON.stringify({
            email: EMAIL,
            password: PASSWORD
        })
    });

    if (!loginRes.ok) {
        console.log("Login Failed - Auth Identity likely NOT created.");
        console.log(await loginRes.text());
    } else {
        console.log("Login Success! Auth Identity WAS created automatically.");
        const loginBody = await loginRes.json();
        console.log("Token:", loginBody.token);
    }
}

testStoreRegister().catch(console.error);
