import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../../common/config/db.js'
import ApiError from '../../common/utils/api-error.js'

export const register = async ({ name,email,password}) => {
    //if the user exists
    const checkSql = "SELECT * FROM users WHERE email =$1"

    const { rows:existingUsers} = await pool.query(checkSql, [email])
    if(existingUsers.length >0) throw ApiError.conflict("Email Already Exists");

    const hashedPassword = await bcrypt.hash(password,12)

    //insert into db, return the new user without password 
    const insertSql = `
    INSERT INTO users (name,email,password)
    VALUES($1,$2,$3)
    RETURNING id,name,email
    `

    const {rows:newUsers} = await pool.query(insertSql, [name,email,hashedPassword])

    return newUsers[0]
}

export const login = async({email,password}) =>{
    const findSql = "SELECT * FROM users WHERE email =$1"
    const {rows:users} = await pool.query(findSql, [email])

    if(users.length === 0 ) throw ApiError.unauthorized("Invalid Email OR Password");
    
    const user = users[0]

    const isMatch = await bcrypt.compare(password,user.password)
    if (!isMatch) throw ApiError.unauthorized("Invalid Email OR Password");

    //token generate 
    const accessToken = jwt.sign({
        id:user.id, 
        email:user.email
    },
    process.env.JWT_SECRET || 'fallback_secret',
    {expiresIn:'1d'}
)
delete user.password
return { user, accessToken}

}

export const getMe = async(userId) =>{
    const sql = "SELECT id,name,email FROM users WHERE id=$1"
    const {rows}= await pool.query(sql,[userId  ])
    if(rows.length===0) {
        throw ApiError.notFound("User Not Found")
    }
    return rows[0]
    
}