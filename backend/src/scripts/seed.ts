// src/scripts/seed.ts
import fs from "fs";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

const BASE = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";
const ADMIN_KEY = process.env.ADMIN_API_KEY;

if (!ADMIN_KEY) {
  console.error("ERROR: ADMIN_API_KEY must be set in backend/.env.local");
  process.exit(1);
}

console.log(`Using Admin Key: ${ADMIN_KEY.slice(0, 4)}... (Type: ${ADMIN_KEY.startsWith("sk_") ? "Secret" : "Bearer"})`);

let authHeader = "";
if (ADMIN_KEY.startsWith("sk_")) {
  const token = Buffer.from(ADMIN_KEY + ":").toString('base64');
  authHeader = `Basic ${token}`;
} else {
  authHeader = `Bearer ${ADMIN_KEY}`;
}

const client = axios.create({
  baseURL: BASE,
  headers: {
    Authorization: authHeader,
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

async function ensureRegion() {
  const { data } = await client.get("/admin/regions?limit=1");
  if (data.regions && data.regions.length) return data.regions[0];
  const res = await client.post("/admin/regions", {
    name: "Seed Region",
    currency_code: "USD",
    countries: ["US"],
  });
  return res.data.region;
}

async function ensureStore(regionId: string) {
  const { data } = await client.get("/admin/stores?limit=1");
  let store = data.stores?.[0];
  if (store) {
    // metadata check or simple return
    return store;
  }
  // If no store exists (unlikely in v2), try create
  const res = await client.post("/admin/stores", {
    name: "Default Store",
    supported_currencies: [{ currency_code: "usd", is_default: true }],
    default_sales_channel_id: null, // Optional
    default_region_id: regionId,
    default_location_id: null
  });
  return res.data.store;
}

async function ensureSalesChannel(storeId: string) {
  const { data } = await client.get("/admin/sales-channels?limit=100");
  const existing = data.sales_channels?.find((s: any) => s.is_gift_card_enabled !== undefined) || data.sales_channels?.[0];
  if (existing) return existing;
  const res = await client.post("/admin/sales-channels", {
    name: "Seed Sales Channel",
    is_default: true,
  });
  return res.data.sales_channel;
}

async function createPublishableKey(sales_channel_id: string) {
  // Look for an existing publishable key
  const { data: list } = await client.get("/admin/api-keys?type=publishable&limit=100");
  if (list.api_keys && list.api_keys.length) return list.api_keys[0];
  const res = await client.post("/admin/api-keys", {
    title: "seed-pk",
    type: "publishable",
    sales_channel_id,
  });
  return res.data.api_key;
}

async function writeEnv(keyName: string, value: string) {
  const envPath = path.resolve(process.cwd(), ".env.local");
  let content = "";
  if (fs.existsSync(envPath)) content = fs.readFileSync(envPath, "utf8");
  // replace or append
  const re = new RegExp(`^${keyName}=.*$`, "m");
  if (re.test(content)) {
    content = content.replace(re, `${keyName}=${value}`);
  } else {
    if (content.length && !content.endsWith("\n")) content += "\n";
    content += `${keyName}=${value}\n`;
  }
  fs.writeFileSync(envPath, content, "utf8");
  console.log("Wrote", keyName, "to", envPath);
}

(async function main() {
  try {
    console.log("Connected to", BASE);
    const region = await ensureRegion();
    console.log("Region ok:", region.id || region);
    const store = await ensureStore(region.id);
    console.log("Store ok:", store.id || store);
    const channel = await ensureSalesChannel(store.id);
    console.log("Sales channel ok:", channel.id || channel);
    const pk = await createPublishableKey(channel.id);
    console.log("Publishable key created:", pk.token || pk.token || JSON.stringify(pk).slice(0, 40));
    // write MEDUSA_PUBLISHABLE_KEY to backend/.env.local
    if (pk && pk.token) {
      await writeEnv("MEDUSA_PUBLISHABLE_KEY", pk.token);
      console.log("Publishable key saved; copy this to storefront env as NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY");
    } else {
      console.warn("Could not obtain token; check admin API permissions");
    }
    console.log("Seed complete.");
    process.exit(0);
  } catch (err: any) {
    console.error("Seed failed:", err.response?.data || err.message || err);
    process.exit(1);
  }
})();
