import * as authService from './auth.service.js'
import ApiResponse from '../../common/utils/api-response.js'

export const register = async(req,res,next) =>{
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
        res.cookie('accessToken', accessToken, {
            httpOnly :true,
            secure:process.env.NODE_ENV === 'production',
            maxAge: 24*60*60*1000 //For 1 day
        })
        return ApiResponse.ok(res, 'Login Successful', {user})
    } catch(err){
        next(err)
    }
}

export const getMe = async(req,res,next) => {
    try{
        const user = await authService.getMe(req.user.id)
        return ApiResponse.ok(
            res, "User Profile",user
        )
    } catch(err){
        next(err)
    }
}
export const logout = async(req,res) =>{
    res.clearCookie('accessToken')
    return res.status(200).json({
        success:true,
        message:"Logged Out Successfully"
    })

}