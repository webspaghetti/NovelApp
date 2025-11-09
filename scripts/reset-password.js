require('dotenv').config({ path: '.env.local' });
require('dotenv').config(); // Fallback on .env

const mysql = require('mysql2/promise');

async function resetPassword() {
    const username = process.argv[2];

    if (!username) {
        console.error('Usage: node scripts/reset-password.js <username>');
        process.exit(1);
    }

    // Create connection using env vars
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        console.log('Connected to database');

        // Set password to null
        const [result] = await connection.execute(
            'UPDATE users SET password = NULL WHERE username = ?',
            [username]
        );

        if (result.affectedRows === 0) {
            console.error(`User "${username}" not found`);
            await connection.end();
            process.exit(1);
        }

        console.log(`✓ Password reset for "${username}"`);
        console.log('They can set a new password on next login.');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        if (connection) await connection.end();
        process.exit(1);
    }
}

resetPassword();