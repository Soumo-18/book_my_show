import pg from "pg";

const pool = new pg.Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5433,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'sql_class_2_db',
    max:20,
})

export const connectDB = async() =>{
    try{
        const client = await pool.connect()
        console.log(`PostgreSql Connected: ${client.host}`)
        client.release()
    } catch(error){
        console.error('Database Connection Failed',error)
        process.exit(1)
    }
}

export default pool