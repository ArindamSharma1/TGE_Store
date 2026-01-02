import Medusa from "@medusajs/js-sdk";

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_dummy"; // User needs to set this

export const medusaClient = new Medusa({
    baseUrl: BACKEND_URL,
    debug: process.env.NODE_ENV === "development",
    publishableKey: PUBLISHABLE_KEY
});

