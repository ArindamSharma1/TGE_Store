const fetch = require('node-fetch'); // Medusa backend likely has node-fetch or global fetch in Node 18+

const API_KEY = "pk_fe5c9a3efe63600ecd8e5442857f33d665324907e9ed7e60449d5647d1a0e5df";
const URL = "http://localhost:9000/store/products";

async function testKey() {
    console.log(`Testing API Key: ${API_KEY}`);
    try {
        const res = await fetch(URL, {
            headers: {
                "x-publishable-api-key": API_KEY,
                "Content-Type": "application/json"
            }
        });

        console.log(`Status: ${res.status}`);
        if (!res.ok) {
            const text = await res.text();
            console.log(`Error Body: ${text}`);
        } else {
            console.log("Success! Key is valid.");
            const data = await res.json();
            console.log(`Found ${data.products ? data.products.length : 0} products.`);
        }
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

testKey();
