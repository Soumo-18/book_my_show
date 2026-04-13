import jwt from 'jsonwebtoken'
import ApiError from '../../common/utils/api-error.js'

export const authenticate = async(req,res,next) =>{
    try{
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith('Bearer')) {
            throw ApiError.unauthorized('Not authenticated')
        }

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRET || 'fallback_secret')

        req.user = decoded
        next()

    } catch(err){
        next(ApiError.unauthorized('Invalid or Expired Token'))
    }
}