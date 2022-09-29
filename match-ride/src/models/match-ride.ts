import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { LocationType, MatchRideStatus } from "@kmalae.ltd/library";

interface MatchRideAttr {
	passenger: string;
	driver: string;
	ride: string;
	vehicle: string;
	destination: LocationType;
	timeOfDeparture: Date;
}

export interface MatchRideDoc extends mongoose.Document {
	status: MatchRideStatus;
	version: number;
}

interface MatchRideModel extends mongoose.Model<MatchRideDoc> {
	build(attr: MatchRideAttr): MatchRideDoc;
}

const MatchRideSchema = new mongoose.Schema(
	{
		passenger: { type: mongoose.Types.ObjectId, required: true },
		driver: { type: mongoose.Types.ObjectId, required: true },
		ride: { type: mongoose.Types.ObjectId, required: true },
		vehicle: { type: mongoose.Types.ObjectId, required: true },
		destination: { type: Object, required: true },
		timeOfDeparture: { type: Date, required: true },
		status: {
			type: String,
			required: true,
			enum: Object.values(MatchRideStatus),
			default: MatchRideStatus.requested,
		},
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

MatchRideSchema.index({ _id: 1, ride: 1, passenger: 1, driver: 1 });
MatchRideSchema.set("versionKey", "version");
MatchRideSchema.plugin(updateIfCurrentPlugin);

MatchRideSchema.statics.build = (attrs: MatchRideAttr) => {
	return new MatchRide(attrs);
};

const MatchRide = mongoose.model<MatchRideDoc, MatchRideModel>(
	"MatchRide",
	MatchRideSchema
);

export { MatchRide };
