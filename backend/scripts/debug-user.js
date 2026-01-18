const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || "postgres://postgres:arind%40400jmc@localhost/medusa";
const client = new Client({ connectionString });

async function test() {
    await client.connect();

    // Check auth_identity tables
    try {
        const res = await client.query('SELECT * FROM "auth_identity"');
        console.log("Auth Identities:");
        res.rows.forEach(r => {
            console.log(` - ID: ${r.id}`);
            console.log(`   ActorTyp: ${r.actor_type}`); // Assuming this exists?
            console.log(`   ActorID: ${r.actor_id}`);   // Does this exist??
            console.log(`   AppMeta: ${JSON.stringify(r.app_metadata)}`);
        });
    } catch (e) {
        console.log("Error querying auth_identity:", e.message);
    }

    // Check user table to get the User ID
    const uRes = await client.query('SELECT id, email FROM "user" WHERE email = \'admin@medusa-test.com\'');
    if (uRes.rows.length > 0) {
        console.log(`\nUser ID for admin: ${uRes.rows[0].id}`);
    }

    await client.end();
}

test();
