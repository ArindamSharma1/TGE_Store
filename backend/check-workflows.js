const fetch = require('node-fetch');

const BACKEND_URL = "http://localhost:9000";
const EMAIL = "finaladmin@tgs.com";
const PASSWORD = "password123";

async function checkWorkflows() {
    console.log("1. Authenticating as Admin...");
    const loginRes = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });

    if (!loginRes.ok) {
        console.error("Admin Login Failed:", loginRes.status, await loginRes.text());
        return;
    }

    const { token } = await loginRes.json();
    console.log("Admin Login Successful. Token received.");

    console.log("2. Fetching recent Workflow Executions...");
    const workflowsRes = await fetch(`${BACKEND_URL}/admin/workflows-executions?limit=50`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (!workflowsRes.ok) {
        console.error("Fetch Workflows Failed:", workflowsRes.status, await workflowsRes.text());
        return;
    }

    const { workflow_executions } = await workflowsRes.json();
    console.log(`Found ${workflow_executions.length} executions.`);

    // Filter for customer creation workflows
    const customerWorkflows = workflow_executions.filter(w => w.workflow_id === 'create-customer-account');
    console.log(`Found ${customerWorkflows.length} 'create-customer-account' workflows.`);

    const failed = customerWorkflows.find(w => w.state === "failed" || w.state === "reverted");

    if (!failed) {
        console.log("No FAILED or REVERTED workflows found in the last 10 executions.");
        return;
    }

    console.log("\n⚠️ FOUND FAILED WORKFLOW ⚠️");
    console.log(`ID: ${failed.id}`);
    console.log(`Name: ${failed.workflow_id}`); // Usually 'create-customer-account'
    console.log(`State: ${failed.state}`);
    console.log(`Created At: ${failed.created_at}`);

    // If there are specific errors in the top-level object, print them
    if (failed.errors) {
        console.log("\nErrors:", JSON.stringify(failed.errors, null, 2));
    }

    // Usually we need to look at the steps to find the specific error
    // In some versions, steps are included, in others we might need to fetch details
    // Let's try to print the context or transaction error if available
    if (failed.transaction_context && failed.transaction_context.error) {
        console.log("\nTransaction Error:", JSON.stringify(failed.transaction_context.error, null, 2));
    } else {
        // Fallback: Fetch full details if needed (guessing endpoint structure for V2)
        console.log("Fetching full execution details...");
        const detailRes = await fetch(`${BACKEND_URL}/admin/workflows-executions/${failed.id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (detailRes.ok) {
            const detail = await detailRes.json();
            // Try to find the step that failed
            // Note: Structure varies, just dumping the relevant parts
            const failedKeys = Object.keys(detail.workflow_execution?.execution?.steps || {}).filter(k => detail.workflow_execution.execution.steps[k].status === 'failed' || detail.workflow_execution.execution.steps[k].status === 'reverted');
            console.log("\nFailed Steps IDs:", failedKeys);

            if (failedKeys.length > 0) {
                const firstFailed = detail.workflow_execution.execution.steps[failedKeys[0]];
                console.log("Failed Step Details:", JSON.stringify(firstFailed, null, 2));

                // Look for error/exception/payload
                if (firstFailed.definition && firstFailed.definition.compensate) {
                    // Often validation errors are here
                }
            }

            // Also check if there is a global error
            if (detail.workflow_execution?.context?.error) {
                console.log("Workflow Context Error:", JSON.stringify(detail.workflow_execution.context.error, null, 2));
            }
        }
    }
}

checkWorkflows().catch(console.error);
