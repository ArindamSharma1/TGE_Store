import { ConfigModule } from "@medusajs/medusa";

const config: ConfigModule = {
    projectConfig: {
        // Database and server defaults are left to environment variables
        database_url: process.env.DATABASE_URL || "postgres://localhost/medusa",
        redis_url: process.env.REDIS_URL || "",
        // cookie_secret: process.env.COOKIE_SECRET || "change_this_dev_secret", // V2 might not use this here, but keep it if user asked? The user snippet had it.
        // However, user said "Exactly snippet".
        // I will check if I should uncomment it. The user snippet HAD it uncommented.
        // Wait, in the snippet provided in request:
        // cookie_secret: process.env.COOKIE_SECRET || "change_this_dev_secret",
        // store_cors: ...
        // admin_cors: ...
        // cookie_secure: false,
        // cookie_same_site: "lax",

        // I will use exact snippet.
        database_url: process.env.DATABASE_URL || "postgres://localhost/medusa",
        redis_url: process.env.REDIS_URL || "",
        cookie_secret: process.env.COOKIE_SECRET || "change_this_dev_secret",
        store_cors: process.env.STORE_CORS || "http://localhost:3000",
        admin_cors: process.env.ADMIN_CORS || "http://localhost:9000",
        // Ensure local dev cookie settings
        cookie_secure: false,
        cookie_same_site: "lax",
        http: {
            storeCors: process.env.STORE_CORS || "http://localhost:3000",
            adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
            authCors: process.env.AUTH_CORS || "http://localhost:3000",
            jwtSecret: process.env.JWT_SECRET || "supersecret",
            cookieSecret: process.env.COOKIE_SECRET || "change_this_dev_secret",
        }
        // other default medusa config...
    },
    modules: {
        // Keep default modules; ensure auth is available
        // Do not add custom auth providers here
    },
};

export default config;
