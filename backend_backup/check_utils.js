
try {
    const utils = require("@medusajs/utils");
    console.log("loadEnv in @medusajs/utils:", !!utils.loadEnv);
} catch (e) {
    console.log("Error requiring @medusajs/utils:", e.message);
}
