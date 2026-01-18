import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";
import { createCustomerAccountWorkflow } from "@medusajs/medusa/core-flows";

console.log("--> LOADING SUBSCRIBER: account-created.ts <--");

export default async function handleAccountCreated({
    event: { data },
    container,
}: SubscriberArgs<{ id: string }>) {

    console.log("Received auth.identity.created for:", data.id);

    try {
        await createCustomerAccountWorkflow(container).run({
            input: {
                auth_identity_id: data.id,
            },
        });
        console.log("Successfully created customer for identity:", data.id);
    } catch (e) {
        console.error("Failed to create customer for identity:", data.id, e);
    }
}

export const config: SubscriberConfig = {
    event: "auth.identity.created",
};
