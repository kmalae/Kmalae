import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// importing error-types, middlewares, and types
import { TopupHistory } from "@kmalae.ltd/library";

interface TopupAttr {
	user: string;
	points: number;
	// lastUsedCard?: CreditCardType;
	TopupsPerfomed: TopupHistory[];
}

export interface TopupDoc extends TopupAttr, mongoose.Document {
	version: number;
}

interface TopupModel extends mongoose.Model<TopupDoc> {
	build(attr: TopupAttr): TopupDoc;
	getTopupHistory(user: mongoose.Types.ObjectId): TopupHistory[];
}

const topupSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
		points: { type: Number, required: true },
		// lastUsedCard: { type: Object, required: false },
		TopupsPerfomed: { type: Array, required: false },
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

topupSchema.index({ user: 1 });
topupSchema.set("versionKey", "version");
topupSchema.plugin(updateIfCurrentPlugin);

topupSchema.statics.build = (attrs: TopupAttr) => {
	return new Topup(attrs);
};

const Topup = mongoose.model<TopupDoc, TopupModel>("Topup", topupSchema);

export { Topup };
