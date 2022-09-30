import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ReviewAttr {
	passenger: string;
	driver: string;
	rideRequest: string;
	liftRequest: string;
	matchRide: string;
	passengerRated: number;
	passengerCommented: string;
	driverRated: number;
	driverCommented: string;
	version: number;
}

export interface ReviewDoc extends ReviewAttr, mongoose.Document {
	version: number;
}

interface ReviewModel extends mongoose.Model<ReviewDoc> {
	build(attr: ReviewAttr): ReviewDoc;
}

const reviewSchema = new mongoose.Schema(
	{
		passenger: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
		driver: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
		rideRequest: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "RideRequest",
		},
		liftRequest: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "LiftRequest",
		},
		matchRide: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "MatchRide",
		},
		passengerRated: { type: Number, required: true },
		passengerCommented: { type: String, required: true },
		driverRated: { type: Number, required: true },
		driverCommented: { type: String, required: true },
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.__v;
			},
		},
		timestamps: { createdAt: false },
	}
);

reviewSchema.index({
	passenger: 1,
	driver: 1,
	rideRequest: 1,
	liftRequest: 1,
	matchRide: 1,
});
reviewSchema.set("versionKey", "version");
reviewSchema.plugin(updateIfCurrentPlugin);

reviewSchema.statics.build = (attrs: ReviewAttr) => {
	return new Review(attrs);
};

const Review = mongoose.model<ReviewDoc, ReviewModel>("Review", reviewSchema);

export { Review };
