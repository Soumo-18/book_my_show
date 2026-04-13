import * as bookingService from './booking.service.js'
import ApiError from '../../common/utils/api-error.js'

export const getSeats= async(req,res)=>{
    const seats = await bookingService.getAllSeats()
    res.send(seats) //sending raw array to not break existing frontent
}

export const bookSeat = async(req,res)=>{
    const seatId = req.params.id

    const result = await bookingService.bookSeat(seatId,req.user.id, req.user.name)

    if(result.error){
        res.send({error:result.error})
    }
    else{
        res.send(result)
    }

}