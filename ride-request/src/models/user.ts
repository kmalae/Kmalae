import mongoose from "mongoose";

interface UserAttr {
	_id: string;
	email: string;
	version: number;
}

export interface UserDoc extends mongoose.Document {
	_id: string;
	email: string;
	version: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
	build(attr: UserAttr): UserDoc;
}

const userSchema = new mongoose.Schema(
	{
		_id: { type: mongoose.Types.ObjectId, required: true },
		email: { type: String, required: true },
		version: { type: Number, required: true },
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

userSchema.index({ id: 1, email: 1 });

userSchema.statics.build = (attrs: UserAttr) => {
	return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
