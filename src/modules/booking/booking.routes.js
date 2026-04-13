import { Router } from "express";
import * as controller from './booking.controller.js'
import { authenticate } from "../auth/auth.middleware.js";

const router = Router()

//GET -> /seats
router.get('/seats', controller.getSeats)

// PUT -> /:id/:name Protected 

router.put('/:id/:name', authenticate, controller.bookSeat);




export default router 