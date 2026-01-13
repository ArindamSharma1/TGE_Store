import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function getPublishableKey({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    console.log("--- FETCHING KEYS ---");
    const { data: keys } = await query.graph({
        entity: "api_key",
        fields: ["token", "title"],
        filters: {
            type: "publishable",
        },
    });

    if (keys.length === 0) {
        console.log("No publishable keys found.");
    } else {
        keys.forEach(k => {
            console.log(`FOUND_KEY: ${k.token}`);
        });
    }
    console.log("--- DONE ---");
}
