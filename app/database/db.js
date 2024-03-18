"use server"
import mysql from "mysql2/promise";

async function executeQuery(query) {
    try {
        const dbconnection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            database: 'novel_app',
            user: 'root',
            password: '',
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