// src/scripts/seed.ts
import fs from "fs";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

const BASE = process.env.MEDUSA_BACKEND_URL || "http://127.0.0.1:9000";
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

interface Region {
  id: string;
  name: string;
  currency_code: string;
  countries: any[];
  [key: string]: any;
}

async function ensureRegions() {
  console.log("Ensuring India Region...");
  const { data } = await client.get("/admin/regions?limit=100");
  const existingRegions = data.regions || [];

  let india = existingRegions.find((r: any) => r.currency_code === "inr");
  if (!india) {
    console.log("Creating India region...");
    const res = await client.post("/admin/regions", {
      name: "India",
      currency_code: "inr",
      countries: ["in"],
      // mid_code: "in" - not needed usually
    });
    india = res.data.region;
  }
  console.log("India Region ID:", india.id);
  // Return india and list of all for cleanup
  return { india, all: existingRegions };
}

async function cleanupRegions(keepId: string) {
  console.log("Cleaning up old regions...");
  const { data } = await client.get("/admin/regions?limit=100");
  for (const r of data.regions) {
    if (r.id !== keepId) {
      console.log(`Deleting region: ${r.name} (${r.id})`);
      try {
        await client.delete(`/admin/regions/${r.id}`);
      } catch (e: any) {
        console.warn(`Failed to delete ${r.id}: ${e.message}`);
      }
    }
  }
}

async function ensureStore(regionId: string) {
  const { data } = await client.get("/admin/stores?limit=1");
  let store = data.stores?.[0];
  if (store) {
    console.log("Updating Store default region...");
    try {
      const update = await client.post(`/admin/stores/${store.id}`, {
        default_region_id: regionId,
        supported_currencies: [{ currency_code: "inr", is_default: true }]
      });
      return update.data.store;
    } catch (e: any) {
      console.error("Store Update Failed:", e.response?.data || e.message);
      return store;
    }
  }

  console.log("Creating Default Store with India region...");
  const res = await client.post("/admin/stores", {
    name: "Default Store",
    supported_currencies: [{ currency_code: "inr", is_default: true }],
    default_sales_channel_id: null,
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

    // 1. Ensure India
    const { india } = await ensureRegions();

    // 2. Update Store to use India
    const store = await ensureStore(india.id);
    console.log("Store updated:", store.id);

    // 3. Delete others
    await cleanupRegions(india.id);

    const channel = await ensureSalesChannel(store.id);
    console.log("Sales channel ok:", channel.id || channel);

    const pk = await createPublishableKey(channel.id);
    console.log("Publishable key created:", pk.token || pk.token || JSON.stringify(pk).slice(0, 40));

    if (pk && pk.token) {
      await writeEnv("MEDUSA_PUBLISHABLE_KEY", pk.token);
      console.log("Publishable key saved; copy this to storefront env as NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY");
    } else {
      console.warn("Could not obtain token; check admin API permissions");
    }

    // Verify Regions
    console.log("\n----- Verifying Regions -----");
    const { data: verifyData } = await client.get("/admin/regions?limit=100");
    verifyData.regions?.forEach((r: any) => {
      console.log(`Region: ${r.name} (${r.currency_code}) - Countries: ${r.countries?.map((c: any) => c.iso_2).join(", ")}`);
    });
    console.log("-----------------------------");

    console.log("Seed complete.");
    process.exit(0);
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error("Seed failed (Axios):");
      console.error("  Message:", err.message);
      console.error("  Code:", err.code);
      console.error("  Status:", err.response?.status);
      if (err.response?.data) {
        console.error("  Data:", JSON.stringify(err.response.data, null, 2));
      }
    } else {
      console.error("Seed failed:", err.message, err);
    }
    process.exit(1);
  }
})();
