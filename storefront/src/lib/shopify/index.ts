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
    const endpoint = `https://${domain}/api/2023-10/graphql.json`;
    const key = storefrontAccessToken;

    try {
        const result = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': key!,
                ...headers,
            },
            body: JSON.stringify({
                ...(query && { query }),
                ...(variables && { variables }),
            }),
            cache,
            ...(cache !== 'no-store' && { next: { revalidate: 900 } }), // Only revalidate if caching is enabled
        });

        const body = await result.json();

        if (body.errors) {
            throw body.errors[0];
        }

        return body.data;
    } catch (e) {
        console.error('Error connecting to Shopify:', e);
        throw {
            error: e,
            query,
        };
    }
}
