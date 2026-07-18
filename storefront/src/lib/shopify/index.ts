"use server";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function shopifyFetch<T>({
    query,
    variables,
    headers,
    cache = 'force-cache',
}: {
    query: string;
    variables?: Record<string, unknown>;
    headers?: Record<string, string>;
    cache?: RequestCache;
}): Promise<T> {
    // Guard: skip fetch entirely when env vars are not configured
    if (!domain || domain === 'undefined' || !storefrontAccessToken) {
        // Only log once per cold start in development
        if (process.env.NODE_ENV === 'development') {
            console.warn(
                '[TGE] Shopify env vars not set — skipping fetch. ' +
                'Add SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN to .env.local'
            );
        }
        return {} as T;
    }

    const endpoint = `https://${domain}/api/2023-10/graphql.json`;

    try {
        const result = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
                ...headers,
            },
            body: JSON.stringify({
                ...(query && { query }),
                ...(variables && { variables }),
            }),
            cache,
            ...(cache !== 'no-store' && { next: { revalidate: 900 } }),
        });

        const body = await result.json();

        if (body.errors) {
            throw body.errors[0];
        }

        return body.data;
    } catch (e) {
        // Log a compact error — omit the full query to keep the terminal readable
        console.error('[TGE] Shopify fetch failed:', (e as Error)?.message || e);
        throw e;
    }
}
