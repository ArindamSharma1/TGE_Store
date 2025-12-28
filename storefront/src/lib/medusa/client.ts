import Medusa from "@medusajs/medusa-js";

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export const medusaClient = new Medusa({ baseUrl: BACKEND_URL, maxRetries: 3 });

// Helper to get products (example)
export async function getProducts() {
    const { products } = await medusaClient.products.list();
    return products;
}
