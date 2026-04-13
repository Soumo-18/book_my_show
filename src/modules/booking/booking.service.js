import pool from "../../common/config/db.js";
import ApiError from "../../common/utils/api-error.js";

export const getAllSeats = async()=> {
    const result = await pool.query("SELECT * FROM seats ORDER BY id")
    return result.rows
}

export const bookSeat = async(seatId, userId, userName) =>{
    const conn = await pool.connect()

    try {
        await conn.query("BEGIN")
        
        const checkSql = "SELECT * FROM seats WHERE id = $1 AND isBooked = 0 FOR UPDATE"
        const result = await conn.query(checkSql, [seatId])

        if(result.rowCount === 0) {
            throw ApiError.badRequest("Seat already booked or does not exist")
        }
        const updateSql = "UPDATE seats SET isbooked =1, name=$2, user_id = $3 WHERE id = $1"
        await conn.query(updateSql, [seatId,userName,userId])
        await conn.query("COMMIT")
        return {success:true, seatId}
    } catch (err) {
        await conn.query("ROLLBACK")
        throw err
        
    } finally {
        conn.release()
    }
}