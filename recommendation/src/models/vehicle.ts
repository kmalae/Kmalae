import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// importing error-types, middlewares, and types
import { VehicleStatus } from "@kmalae.ltd/library";

interface VehicleAttr {
	_id: string;
	carBrand: string;
	carModel: string;
	MPG: number;
	user: string;
	carImage: {
		data: Buffer;
		contentType: string;
	};
}

export interface VehicleDoc extends mongoose.Document {
	_id: string;
	carBrand: string;
	carModel: string;
	MPG: number;
	user: string;
	carImage: {
		data: Buffer;
		contentType: string;
	};
	version: number;
}

interface VehicleModel extends mongoose.Model<VehicleDoc> {
	build(attrs: VehicleAttr): VehicleDoc;
}

const vehicleSchema = new mongoose.Schema(
	{
		_id: { type: mongoose.Types.ObjectId, required: true },
		carBrand: { type: String, required: true },
		carModel: { type: String, required: true },
		MPG: { type: Number, required: true },
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		carImage: { type: Object, required: true },
		status: {
			type: String,
			required: true,
			enum: Object.values(VehicleStatus),
			default: VehicleStatus.Active,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.carImage;
				delete ret.__v;
			},
		},
		timestamps: { createdAt: false },
		_id: false,
	}
);

vehicleSchema.index({ _id: 1, user: 1 });
vehicleSchema.set("versionKey", "version");
vehicleSchema.plugin(updateIfCurrentPlugin);

vehicleSchema.statics.build = (attrs: VehicleAttr) => {
	return new Vehicle(attrs);
};

const Vehicle = mongoose.model<VehicleDoc, VehicleModel>(
	"Vehicle",
	vehicleSchema
);

export { Vehicle };
