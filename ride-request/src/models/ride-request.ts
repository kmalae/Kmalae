import mongoose from "mongoose";
import { RideRequestStatus } from "@kmalae.ltd/library";

interface RequestAttr {
	pickUpPoint: {
		lat: string;
		lng: string;
	};
	destination: {
		lat: string;
		lng: string;
	};
	timeOfDeparture: Date;
	status: RideRequestStatus;
}

export interface RequestDoc extends RequestAttr, mongoose.Document {
	version: number;
	createdAt: Date;
}

interface RequestModel extends mongoose.Model<RequestDoc> {
	build(attr: RequestAttr): RequestDoc;
}

const requestSchema = new mongoose.Schema(
	{
		pickUpPoint: { type: Object, required: true },
		destination: { type: Object, required: true },
		timeOfDeparture: { type: Date, required: true },
		status: {
			type: String,
			required: true,
			enum: Object.values(RideRequestStatus),
			default: RideRequestStatus.Created,
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

requestSchema.index({ email: 1 });
requestSchema.set("versionKey", "version");

requestSchema.statics.build = (attrs: RequestAttr) => {
	return new RideRequest(attrs);
};

const RideRequest = mongoose.model<RequestDoc, RequestModel>(
	"Request",
	requestSchema
);

export { RideRequest };
