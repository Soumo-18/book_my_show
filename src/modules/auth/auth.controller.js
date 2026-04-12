import * as authService from './auth.service.js'
import ApiResponse from '../../common/utils/api-response.js'

export const register = async(req,res,nect) =>{
    try{
        const user = await authService.register(req.body)
        return ApiResponse.created(res,"Registration Successful",user)
    } catch (err) {
        next(err)
    }
} 

export const login = async(req,res,next)=>{
    try{
        const {user,accessToken} = await authService.login(req.body)
        return ApiResponse.ok(res, 'Login Successful', {user,accessToken})
    } catch(err){
        next(err)
    }
}