import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import {
	LocationType,
	MatchRideStatus,
	WhoCancelled,
} from "@kmalae.ltd/library";

interface MatchRideAttr {
	id: string;
	passenger: string;
	driver: string;
	createdAt: Date;
	version: number;
}

export interface MatchRideDoc extends mongoose.Document {
	passenger: string;
	driver: string;
	createdAt: Date;
	status: MatchRideStatus;
	version: number;
}

interface MatchRideModel extends mongoose.Model<MatchRideDoc> {
	build(attr: MatchRideAttr): MatchRideDoc;
}

const MatchRideSchema = new mongoose.Schema(
	{
		passenger: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
		driver: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
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
	}
);

MatchRideSchema.index({ passenger: 1, driver: 1 });
MatchRideSchema.set("versionKey", "version");
MatchRideSchema.plugin(updateIfCurrentPlugin);

MatchRideSchema.statics.build = (attrs: MatchRideAttr) => {
	return new MatchRide({
		_id: attrs.id,
		passenger: attrs.passenger,
		driver: attrs.driver,
		createdAt: attrs.createdAt,
		version: attrs.version,
	});
};

const MatchRide = mongoose.model<MatchRideDoc, MatchRideModel>(
	"MatchRide",
	MatchRideSchema
);

export { MatchRide };
