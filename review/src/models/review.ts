import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ReviewAttr {
	passenger: string;
	driver: string;
	matchRide: string;
	passengerRated?: number;
	passengerCommented?: string;
	driverRated?: number;
	driverCommented?: string;
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
		matchRide: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "MatchRide",
		},
		passengerRated: { type: Number, required: false },
		passengerCommented: { type: String, required: false },
		driverRated: { type: Number, required: false },
		driverCommented: { type: String, required: false },
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
	matchRide: 1,
});
reviewSchema.set("versionKey", "version");
reviewSchema.plugin(updateIfCurrentPlugin);

reviewSchema.statics.build = (attrs: ReviewAttr) => {
	return new Review(attrs);
};

const Review = mongoose.model<ReviewDoc, ReviewModel>("Review", reviewSchema);

export { Review };
