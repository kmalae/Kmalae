import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { UserDoc } from "./user";

import { RideRequestStatus } from "@kmalae.ltd/library";

interface RequestAttr {
	_id: string;
	pickUpPoint: {
		lat: string;
		lng: string;
	};
	destination: {
		lat: string;
		lng: string;
	};
	timeOfDeparture: Date;
	user: string;
	version: number;
}

export interface RequestDoc extends mongoose.Document {
	_id: string;
	pickUpPoint: {
		lat: string;
		lng: string;
	};
	destination: {
		lat: string;
		lng: string;
	};
	timeOfDeparture: Date;
	user: string;
	version: number;
}

interface RequestModel extends mongoose.Model<RequestDoc> {
	build(attr: RequestAttr): RequestDoc;
}

const requestSchema = new mongoose.Schema(
	{
		_id: { type: mongoose.Types.ObjectId, required: true },
		user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
		pickUpPoint: { type: Object, required: true },
		destination: { type: Object, required: true },
		timeOfDeparture: { type: Date, required: true },
		status: {
			type: String,
			required: true,
			enum: Object.values(RideRequestStatus),
			default: RideRequestStatus.Created,
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

requestSchema.index({ _id: 1, user: 1 });
requestSchema.plugin(updateIfCurrentPlugin);
requestSchema.set("versionKey", "version");

requestSchema.statics.build = (attrs: RequestAttr) => {
	return new RideRequest(attrs);
};

const RideRequest = mongoose.model<RequestDoc, RequestModel>(
	"Request",
	requestSchema
);

export { RideRequest };
