import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ReviewAttr {
	_id: string;
	passenger: string;
	driver: string;
	ride: string;
	passengerRated: number;
	passengerCommented: string;
	driverRated: number;
	driverCommented: string;
	version: number;
}

export interface ReviewDoc extends mongoose.Document {
	_id: string;
	passenger: string;
	driver: string;
	ride: string;
	passengerRated: number;
	passengerCommented: string;
	driverRated: number;
	driverCommented: string;
	version: number;
}

interface ReviewModel extends mongoose.Model<ReviewDoc> {
	build(attr: ReviewAttr): ReviewDoc;
}

const reviewSchema = new mongoose.Schema(
	{
		_id: { type: mongoose.Types.ObjectId, required: true },
		passenger: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
		driver: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
		ride: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "RideRequest",
		},
		passengerRated: { type: Number, required: true },
		passengerCommented: { type: String, required: true },
		driverRated: { type: Number, required: true },
		driverCommented: { type: String, required: true },
		version: { type: Number, required: true },
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
		_id: false,
	}
);

reviewSchema.index({ _id: 1, ride: 1, passenger: 1, driver: 1 });
reviewSchema.set("versionKey", "version");
reviewSchema.plugin(updateIfCurrentPlugin);

reviewSchema.statics.build = (attrs: ReviewAttr) => {
	return new Review(attrs);
};

const Review = mongoose.model<ReviewDoc, ReviewModel>("Review", reviewSchema);

export { Review };
