
try {
    const utils = require("@medusajs/utils");
    console.log("loadEnv in @medusajs/utils:", !!utils.loadEnv);
} catch (e) {
    console.log("@medusajs/utils import failed", e.message);
}

try {
    const frameworkUtils = require("@medusajs/framework/utils");
    console.log("loadEnv in @medusajs/framework/utils:", !!frameworkUtils.loadEnv);
    console.log("defineConfig in @medusajs/framework/utils:", !!frameworkUtils.defineConfig);
} catch (e) {
    console.log("@medusajs/framework/utils import failed", e.message);
}
