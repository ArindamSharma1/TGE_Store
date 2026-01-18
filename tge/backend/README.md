# Medusa v2 Backend

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    - `.env.local` has been created with your settings.
    - Ensure `DATABASE_URL` is correct.

## Running

1.  **Start Backend**:
    ```bash
    npm run dev
    ```
    Wait for the server to start at `http://localhost:9000`.

2.  **Seed Data & Verify**:
    (Run in a separate terminal while backend is running)
    ```bash
    npm run seed
    ```
    This will:
    - Authenticate as Admin.
    - Create Region, Store, Sales Channel.
    - Generate `MEDUSA_PUBLISHABLE_KEY`.
    - Verify Customer Registration & Login.

## Output

The `npm run seed` command will print the `MEDUSA_PUBLISHABLE_KEY`.
**Copy this key** to your Storefront's `.env.local`.
