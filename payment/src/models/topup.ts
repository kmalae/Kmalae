import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// importing error-types, middlewares, and types
import { TopupHistory } from "@kmalae.ltd/library";

interface TopupAttr {
	_id: string;
	user: string;
	points: number;
}

export interface TopupDoc extends mongoose.Document {
	_id: string;
	user: string;
	points: number;
	version: number;
}

interface TopupModel extends mongoose.Model<TopupDoc> {
	build(attr: TopupAttr): TopupDoc;
}

const topupSchema = new mongoose.Schema(
	{
		_id: { type: mongoose.Types.ObjectId, required: true },
		user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
		points: { type: Number, required: true },
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

topupSchema.index({ _id: 1, user: 1 });
topupSchema.set("versionKey", "version");
topupSchema.plugin(updateIfCurrentPlugin);

topupSchema.statics.build = (attrs: TopupAttr) => {
	return new Topup(attrs);
};

const Topup = mongoose.model<TopupDoc, TopupModel>("Topup", topupSchema);

export { Topup };
