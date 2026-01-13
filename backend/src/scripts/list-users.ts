import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function listUsers({ container }: ExecArgs) {
    const userModuleService = container.resolve(Modules.USER);

    console.log("--- LISTING USERS ---");
    const users = await userModuleService.listUsers();

    if (users.length === 0) {
        console.log("No users found.");
    } else {
        users.forEach(u => {
            console.log(`User: ${u.email} (ID: ${u.id})`);
        });
    }
    console.log("--- DONE ---");
}
