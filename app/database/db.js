import mysql from "mysql2/promise";

async function executeQuery(query) {
    try{
        const dbconnection= await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            database: 'novel_app',
            user: 'root',
            password: ''
        })

        const [result] = await dbconnection.execute(query);
        await dbconnection.end();
        console.log(result);
        return result;
    }catch (e){
        console.error(e);
        return new Error(e);
    }
}

export default executeQuery;