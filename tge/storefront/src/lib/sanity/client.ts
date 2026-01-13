import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-10-01";

export const sanityClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // set to `true` to fetch from edge cache
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
    return builder.image(source);
}
