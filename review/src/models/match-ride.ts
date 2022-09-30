import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import {
	LocationType,
	MatchRideStatus,
	WhoCancelled,
} from "@kmalae.ltd/library";

interface MatchRideAttr {
	_id: string;
	passenger: string;
	driver: string;
	ride: string;
	vehicle: string;
	destination: LocationType;
	timeOfDeparture: Date;
	status: MatchRideStatus;
	createdAt: Date;
	version: number;
}

export interface MatchRideDoc extends mongoose.Document {
	_id: string;
	passenger: string;
	driver: string;
	ride: string;
	vehicle: string;
	destination: LocationType;
	timeOfDeparture: Date;
	status: MatchRideStatus;
	createdAt: Date;
	whoCancelled: WhoCancelled;
	version: number;
}

interface MatchRideModel extends mongoose.Model<MatchRideDoc> {
	build(attr: MatchRideAttr): MatchRideDoc;
}

const MatchRideSchema = new mongoose.Schema(
	{
		_id: { type: mongoose.Types.ObjectId, required: true },
		passenger: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
		driver: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
		ride: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "RideRequest",
		},
		vehicle: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "Vehicle",
		},
		destination: { type: Object, required: true },
		timeOfDeparture: { type: Date, required: true },
		status: {
			type: String,
			required: true,
			enum: Object.values(MatchRideStatus),
			default: MatchRideStatus.Requested,
		},
		createdAt: { type: Date, required: true, default: Date.now },
		whoCancelled: {
			type: String,
			required: true,
			enum: Object.values(WhoCancelled),
			default: WhoCancelled.None,
		},
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
