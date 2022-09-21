import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

// importing models and services
import { RideRequest } from "../models/ride-request";
import { User } from "../models/user";

// importing error-types and middlewares
import {
	BadRequestError,
	currentUser,
	validateRequest,
  NotAuthorizedError,
  RideRequestStatus
} from "@kmalae.ltd/library";

const router = express.Router();

router.delete(
  "/api/rides/deleteRideRequest",
  [
    body("rideRequestID")
        .notEmpty()
        .withMessage("ride request ID must be provided")
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage("Invalid ride request ID"),
],
  currentUser,
  validateRequest,
  async (req: Request, res: Response) => {
    if(!req.currentUser){
      throw new NotAuthorizedError();
    }
    const { rideRequestID } = req.body;
    
    const { id, email } = req.currentUser;
		const existingUser = await User.findOne({
			id,
			email,
		});

		if (!existingUser) {
			throw new BadRequestError("User does not exist");
		}

    const existingRideRequest = await RideRequest.findById(rideRequestID);
  
    if (!existingRideRequest) {
      throw new BadRequestError("Ride request does not exist");
    }
    
    existingRideRequest.set({
      status: RideRequestStatus.Cancelled
    }).save();

    res.status(200).send(existingRideRequest);
  }
);

export { router as deleteRideRequestRouter };
