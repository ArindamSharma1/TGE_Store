import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { deleteUsersWorkflow } from "@medusajs/medusa/core-flows";

export default async function deleteUser({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const userModuleService = container.resolve(Modules.USER);

    const emailToDelete = "arindamsharma693@gmail.com";

    console.log(`--- DELETING USER: ${emailToDelete} ---`);

    const users = await userModuleService.listUsers({ email: emailToDelete });

    if (users.length === 0) {
        console.log("User not found.");
        return;
    }

    const user = users[0];
    console.log(`Found user ID: ${user.id}`);

    await deleteUsersWorkflow(container).run({
        input: {
            ids: [user.id],
        },
    });

    console.log(`Successfully deleted user: ${emailToDelete}`);
    console.log("--- DONE ---");
}
