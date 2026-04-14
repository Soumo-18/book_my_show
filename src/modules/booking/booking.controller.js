import * as bookingService from './booking.service.js'
import ApiError from '../../common/utils/api-error.js'

export const getSeats= async(req,res)=>{
    const seats = await bookingService.getAllSeats()
    res.send(seats) //sending raw array to not break existing frontent
}

export const bookSeat = async(req,res,next)=>{
    try{
        const {id: seatId} = req.params // from the url
        const { name:userName} = req.body 

        if(!/^\d+$/.test(seatId)){
            throw ApiError.badRequest("Invalid Seat Id. It Must be a Number")
        }
        if(!userName || userName.trim().length ===0  ){
            throw ApiError.badRequest("A Valid Name is Required to Book a Seat")
        }

        const result = await bookingService.bookSeat(seatId, req.user.id, userName)
        res.status(200).send(result)
    } catch(error) {
        next(error)
    }

}