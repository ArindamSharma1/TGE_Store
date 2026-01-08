import { loadEnv, defineConfig } from "@medusajs/framework/utils"
import path from "path"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const modules: any[] = [];

if (process.env.RAZORPAY_KEY_ID) {
  modules.push({
    resolve: path.resolve(process.cwd(), "src/modules/razorpay"),
    options: {
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    }
  })
}

export default defineConfig({
  projectConfig: {
    // Database
    databaseUrl: process.env.DATABASE_URL,

    http: {
      // CORS
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,

      // Security
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules,
})
