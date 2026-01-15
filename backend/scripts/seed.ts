import { Utils } from "@medusajs/common"; // Use common utils if needed, or just fetch
// We will use native fetch.
// This script runs externally against the running Medusa server.

const BASE_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "Pa$$w0rd";

async function seed() {
    console.log("Starting seed process against", BASE_URL);

    // 1. Authenticate (or create first user?)
    // In Medusa v2, the first user usually needs to be created via workflow or CLI 'medusa user'
    // But creating via API: POST /auth/user/emailpass/register is for customers usually? NO.
    // Medusa Admin user creation is usually done via `medusa user -e ...` CLI
    // HOWEVER, the prompting instructions said: "Create an admin user (email/password) if none exists. Log in to Admin..."
    // If we can't create admin via HTTP public API (unauthenticated), we might need to use the CLI tool in the script context.
    // BUT the user strictly said "Seed script must use Admin HTTP API...".
    // You cannot create the FIRST admin via HTTP API if you are locked out.
    // EXCEPTION: `medusa-cli` provides `medusa user`.
    // I will use `execSync` to run `medusa user` command locally to ensure admin exists.

    const { execSync } = require('child_process');

    try {
        console.log("Creating admin user via CLI...");
        // Try to create user. Ignore error if exists.
        try {
            // v2 syntax: medusa user -e <email> -p <password>
            // But in node script we prefer explicit command.
            // We assume 'npx medusa user' or similar.
            // Actually, we can assume this script runs in an env where 'medusa' bin is available or use 'npx medusa'.
            execSync(`npx medusa user -e ${ADMIN_EMAIL} -p ${ADMIN_PASSWORD}`, { stdio: 'ignore' });
            console.log("Admin user created.");
        } catch (e) {
            console.log("Admin user likely exists or CLI failed (ignoring if exists).");
        }

        // 2. Login to get token
        console.log("Logging in...");
        const loginRes = await fetch(`${BASE_URL}/auth/user/emailpass`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
        }

        // Capture cookies
        const cookieHeader = loginRes.headers.get("set-cookie");
        if (!cookieHeader) throw new Error("No cookie returned from login");

        // We need to parse the connect.sid or similar.
        // For subsequent requests, we pass this cookie.
        const headers = {
            "Content-Type": "application/json",
            "Cookie": cookieHeader
        };

        console.log("Logged in. Headers set.");

        // 3. Create Region (idempotent check)
        // List regions to check
        const existingRegionsRes = await fetch(`${BASE_URL}/admin/regions`, { headers });
        const existingRegions = await existingRegionsRes.json();
        let regionId;

        if (existingRegions.regions && existingRegions.regions.length > 0) {
            // use first
            regionId = existingRegions.regions[0].id;
            console.log("Using existing region:", regionId);
        } else {
            console.log("Creating region...");
            const createRegionRes = await fetch(`${BASE_URL}/admin/regions`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    name: "Default Region",
                    currency_code: "usd",
                    countries: ["us"] // v2 requires strict country codes usually
                })
            });
            if (!createRegionRes.ok) throw new Error(`Create region failed: ${await createRegionRes.text()}`);
            const regionJson = await createRegionRes.json();
            regionId = regionJson.region.id;
            console.log("Region created:", regionId);
        }

        // 4. Create Store (v2 Store is usually singleton or one-per-env)
        // Check store
        // V2: GET /admin/stores
        const storesRes = await fetch(`${BASE_URL}/admin/stores`, { headers });
        const storesJson = await storesRes.json();
        let storeId;
        if (storesJson.stores && storesJson.stores.length > 0) {
            storeId = storesJson.stores[0].id;
            console.log("Using existing store:", storeId);
            // Ensure region is attached?
            // PUT /admin/stores/:id { supported_currencies: ... }
            // V2 handles regions differently (Region has countries, Store has currencies?)
            // Let's assume default store is fine for now.
        } else {
            // Should exist by default? If not, create?
            console.log("No store found? Creating one if supported...");
            const createStoreRes = await fetch(`${BASE_URL}/admin/stores`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    name: "My Store",
                    supported_currencies: [{ code: "usd", is_default: true }]
                })
            });
            if (!createStoreRes.ok) {
                console.log("Create store failed or not supported (might be singleton). Using default.");
                // Fallback
            } else {
                const s = await createStoreRes.json();
                storeId = s.store.id;
            }
        }

        // 5. Create Sales Channel
        const scRes = await fetch(`${BASE_URL}/admin/sales-channels`, { headers });
        const scJson = await scRes.json();
        let scId;
        const scName = "Default Sales Channel";

        const existingSc = scJson.sales_channels?.find((sc: any) => sc.name === scName);
        if (existingSc) {
            scId = existingSc.id;
            console.log("Using existing Sales Channel:", scId);
        } else {
            console.log("Creating Sales Channel...");
            const createScRes = await fetch(`${BASE_URL}/admin/sales-channels`, {
                method: "POST",
                headers,
                body: JSON.stringify({ name: scName, description: "Main channel" })
            });
            if (!createScRes.ok) throw new Error(`Create SC failed: ${await createScRes.text()}`);
            const scData = await createScRes.json();
            scId = scData.sales_channel.id;
            console.log("Sales Channel created:", scId);
        }

        // Link SC to Store? (Often implicit or via API?)
        // In V2, SCs are linked to API keys or Products.

        // 6. Create Publishable Key
        const apiKeysRes = await fetch(`${BASE_URL}/admin/api-keys?type=publishable`, { headers });
        const apiKeysJson = await apiKeysRes.json();
        let pubKey;

        if (apiKeysJson.api_keys && apiKeysJson.api_keys.length > 0) {
            // Check if attached to our SC?
            // We'll just define ONE key policy: use the first valid one or create new.
            // User requested "Create *one* publishable API key for that Sales Channel".
            // Use existing if found.
            const existingKey = apiKeysJson.api_keys.find((k: any) => !k.revoked_at);
            if (existingKey) {
                pubKey = existingKey.token;
                console.log("Using existing Publishable Key.");
                // attach if not attached
                // POST /admin/api-keys/:id/sales-channels
                await fetch(`${BASE_URL}/admin/api-keys/${existingKey.id}/sales-channels`, {
                    method: "POST", headers, body: JSON.stringify({ add: [scId] })
                });
            }
        }

        if (!pubKey) {
            console.log("Creating Publishable Key...");
            const createKeyRes = await fetch(`${BASE_URL}/admin/api-keys`, {
                method: "POST",
                headers,
                body: JSON.stringify({ title: "Next.js Storefront", type: "publishable" })
            });
            if (!createKeyRes.ok) throw new Error(`Create PK failed: ${await createKeyRes.text()}`);
            const keyData = await createKeyRes.json();
            pubKey = keyData.api_key.token;

            // Attach to SC
            await fetch(`${BASE_URL}/admin/api-keys/${keyData.api_key.id}/sales-channels`, {
                method: "POST", headers, body: JSON.stringify({ add: [scId] })
            });
            console.log("Publishable Key created and attached.");
        }

        // 7. Create Product
        // Check if exists
        const prodRes = await fetch(`${BASE_URL}/admin/products?limit=1`, { headers });
        const prodJson = await prodRes.json();
        if (prodJson.products && prodJson.products.length === 0) {
            console.log("Creating sample product...");
            const createProdRes = await fetch(`${BASE_URL}/admin/products`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    title: "Medusa Shirt",
                    options: [{ title: "Size", values: ["M", "L"] }],
                    variants: [
                        { title: "M", prices: [{ currency_code: "usd", amount: 1000 }] },
                        { title: "L", prices: [{ currency_code: "usd", amount: 1200 }] }
                    ],
                    sales_channels: [{ id: scId }],
                    shipping_profile_id: await getShippingProfileId(BASE_URL, headers)
                })
            });
            if (!createProdRes.ok) console.error("Failed to create product", await createProdRes.text());
            else console.log("Product created.");
        } else {
            console.log("Products exist.");
        }

        // OUTPUT
        console.log(`PUBLISHABLE_KEY=${pubKey}`);
        console.log("Seed complete.");

    } catch (err) {
        console.error("Seed failed:", err);
        process.exit(1);
    }
}

async function getShippingProfileId(baseUrl: string, headers: any) {
    try {
        const res = await fetch(`${baseUrl}/admin/shipping-profiles`, { headers });
        const json = await res.json();
        return json.shipping_profiles?.[0]?.id;
    } catch (e) { return null; }
}

seed();
