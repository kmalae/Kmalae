import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { UserDoc } from "./user";
import { VehicleDoc } from "./vehicle";

import { LiftRequestStatus, LocationType } from "@kmalae.ltd/library";

interface LiftRequestAttr {
	currentLocation: LocationType;
	destination: LocationType;
	timeOfDeparture: Date;
	user: UserDoc;
	vehicle: VehicleDoc;
}

export interface LiftRequestDoc extends LiftRequestAttr, mongoose.Document {
	version: number;
	createdAt: Date;
	status: LiftRequestStatus;
}

interface LiftRequestModel extends mongoose.Model<LiftRequestDoc> {
	build(attr: LiftRequestAttr): LiftRequestDoc;
}

const liftRequestSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
		vehicle: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "Vehicle",
		},
		currentLocation: { type: Object, required: true },
		destination: { type: Object, required: true },
		timeOfDeparture: { type: Date, required: true },
		status: {
			type: String,
			required: true,
			enum: Object.values(LiftRequestStatus),
			default: LiftRequestStatus.Created,
		},
		createdAt: { type: Date, required: true, default: Date.now },
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

liftRequestSchema.index({ user: 1, vehicle: 1 });
liftRequestSchema.plugin(updateIfCurrentPlugin);
liftRequestSchema.set("versionKey", "version");

liftRequestSchema.statics.build = (attrs: LiftRequestAttr) => {
	return new LiftRequest(attrs);
};

const LiftRequest = mongoose.model<LiftRequestDoc, LiftRequestModel>(
	"Lift",
	liftRequestSchema
);

export { LiftRequest };
