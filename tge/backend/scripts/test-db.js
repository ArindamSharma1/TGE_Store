const { Client } = require('pg');

const config = {
    user: 'postgres',
    password: 'arind@400jmc', // Literal password
    host: 'localhost',
    port: 5432,
    database: 'postgres', // Connect to default DB first to check/create 'medusa'
};

async function main() {
    console.log("📡 Connecting to 'postgres' database to check status...");
    const client = new Client(config);

    try {
        await client.connect();
        console.log("✅ Connected to 'postgres' DB.");

        // Check if medusa exists
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'medusa'");
        if (res.rows.length > 0) {
            console.log("✅ Database 'medusa' EXISTS.");
        } else {
            console.log("⚠️ Database 'medusa' DOES NOT EXIST.");
            console.log("🛠️ Creating database 'medusa'...");
            try {
                await client.query('CREATE DATABASE medusa');
                console.log("✅ Database 'medusa' CREATED.");
            } catch (createErr) {
                console.error("❌ Failed to create database:", createErr.message);
            }
        }
    } catch (err) {
        console.error("❌ Failed to connect to 'postgres' DB:", err);
        console.log("💡 Hint: Password might be wrong or Postgres is not running.");
    } finally {
        await client.end();
    }
}

main();
