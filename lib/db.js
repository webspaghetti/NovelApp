import mysql from 'mysql2/promise';

// Use global object to persist pool across hot reloads
const globalForDb = global;

if (!globalForDb.mysqlPool) {
    globalForDb.mysqlPool = mysql.createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306'),
        database: process.env.DB_DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '20'),
        waitForConnections: true,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        connectTimeout: 10000,
        maxIdle: 20,
        idleTimeout: 60000,
    });
}

const pool = globalForDb.mysqlPool;

export default pool;