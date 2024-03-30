"use server"
import mysql from "mysql2/promise";

async function executeQuery(query) {
    try {
        const dbconnection = await mysql.createConnection({
            host: process.env.DB_HOST, //'localhost'
            port: process.env.DB_PORT, //3306
            database: process.env.DB_DATABASE, //'novel_app'
            user: process.env.DB_USER, //'root'
            password: process.env.DB_PASSWORD, //''
        });

        const [rows] = await dbconnection.execute(query);
        await dbconnection.end();

        return rows.map(row => ({...row}));
    } catch (e){
        if (e.code !== 'ER_DUP_ENTRY') {
            console.error(e);
            // Returning just the message or a serializable object instead of the Error
            return {error: true, message: e.message};
        }
    }
}

export default executeQuery;