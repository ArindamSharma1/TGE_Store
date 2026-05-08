# TGE Store

A full-stack e-commerce storefront built with Next.js, using Shopify as the backend for product management, inventory, and order processing.

Live at: [tge-store.vercel.app](https://tge-store.vercel.app/)

---

## What it does

- Displays products and collections fetched from Shopify's Storefront API
- Handles cart, checkout, and order flow through Shopify
- Implements HTTP-only cookie sessions to keep auth tokens off client-side scripts
- Role-based access control separates admin and customer routes
- Deployed on Vercel with environment variables configured for the Shopify store

---

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Shopify Storefront API
- **Auth:** HTTP-only cookies, RBAC middleware
- **Deployment:** Vercel

---

## Running locally

1. Clone the repo

```bash
git clone https://github.com/ArindamSharma1/tge-store
cd tge-store
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables - create a `.env.local` file in the root:

```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
```

You can get these from your Shopify admin under Apps > Develop apps > Storefront API.

4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Managing products

Products, collections, inventory, and orders are all managed through the Shopify Admin dashboard. The frontend pulls data from the Storefront API at build/request time.

---

## Notes

- Started this project with Medusa as the backend but switched to Shopify API for easier maintenance as a solo developer
- Containerised version available using Docker Compose for local development
- The variable names for .env could differ in actual code

---
