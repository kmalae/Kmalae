import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

import { LocationType, RideRequestStatus } from "@kmalae.ltd/library";

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
	getAcceptableCoordinates(
		coordinate: LocationType,
		timeOfDeparture: Date,
		radius: number
	): Promise<RequestDoc | null>;
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
requestSchema.set("versionKey", "version");
requestSchema.plugin(updateIfCurrentPlugin);

requestSchema.statics.build = (attrs: RequestAttr) => {
	return new RideRequest(attrs);
};

requestSchema.statics.getAcceptableCoordinates = async (
	coordinate,
	radius: number,
	timeOfDeparture: Date
) => {
	const tmpTimeOfDeparture = new Date(timeOfDeparture);
	let currentTime = new Date();
	let timeDiff = 5;

	if (
		timeOfDeparture.getDate() === currentTime.getDate() &&
		timeOfDeparture.getHours() === currentTime.getHours()
	) {
		timeDiff = timeOfDeparture.getMinutes() - currentTime.getMinutes();
	}

	const bufferTime = timeDiff <= 5 ? timeDiff : 5;

	let futureBuffer = timeOfDeparture.setMinutes(
		tmpTimeOfDeparture.getMinutes() + bufferTime
	);
	let priorBuffer = tmpTimeOfDeparture.setMinutes(
		tmpTimeOfDeparture.getMinutes() - bufferTime
	);

	const upperLat = `${parseFloat(coordinate.lat) + radius * 0.0090437173}`;
	const lowerLat = `${parseFloat(coordinate.lat) - radius * 0.0090437173}`;
	const upperLng = `${
		parseFloat(coordinate.lng) -
		(radius * 1) / (111.32 * Math.cos(parseFloat(coordinate.lat)))
	}`;
	const lowerLng = `${
		parseFloat(coordinate.lng) +
		(radius * 1) / (111.32 * Math.cos(parseFloat(coordinate.lat)))
	}`;

	return RideRequest.find()
		.where("timeOfDeparture")
		.gte(priorBuffer)
		.where("timeOfDeparture")
		.lte(futureBuffer)
		.lte("destination.lat", upperLat)
		.gte("destination.lat", lowerLat)
		.lte("destination.lng", upperLng)
		.gte("destination.lng", lowerLng);
};

const RideRequest = mongoose.model<RequestDoc, RequestModel>(
	"Request",
	requestSchema
);

export { RideRequest };
