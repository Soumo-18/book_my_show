import jwt from 'jsonwebtoken'
import ApiError from '../../common/utils/api-error.js'

export const authenticate = async(req,res,next) =>{
    try{
        const token = req.cookies.accessToken        
        if(!token) {
            throw ApiError.unauthorized('Not authenticated')
        }

        const decoded = jwt.verify(token,process.env.JWT_ACCESS_SECRET)

        req.user = decoded
        next()

    } catch(err){
        next(ApiError.unauthorized('Invalid or Expired Token'))
    }
}