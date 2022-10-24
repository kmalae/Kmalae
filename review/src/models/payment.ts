import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// importing error-types, middlewares, and types

interface PaymentAttr {
	_id: string;
	matchRide: string;
	amountPaid: number;
	datePaid: Date;
}

export interface PaymentDoc extends mongoose.Document {
	_id: string;
	matchRide: string;
	amountPaid: number;
	datePaid: Date;
	version: number;
}

interface TopupModel extends mongoose.Model<PaymentDoc> {
	build(attr: PaymentAttr): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
	{
		_id: { type: mongoose.Types.ObjectId, required: true },
		matchRide: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "MatchRide",
		},
		amountPaid: { type: Number, required: true },
		datePaid: { type: Date, required: true },
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

paymentSchema.index({ _id: 1, passenger: 1, driver: 1 });
paymentSchema.set("versionKey", "version");
paymentSchema.plugin(updateIfCurrentPlugin);

paymentSchema.statics.build = (attrs: PaymentAttr) => {
	return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, TopupModel>(
	"Payment",
	paymentSchema
);

export { Payment };
