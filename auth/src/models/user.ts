import mongoose from "mongoose";
import { Password } from "../services/password";

interface UserAttr {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	IDNumber: number;
	dateOfBirth: Date;
	phoneNumber: number;
}

export interface UserDoc extends UserAttr, mongoose.Document {
	fullName: string;
	createdAt: Date;
	passwordLastUpdatedAt?: Date;
	version: number;
}

interface UserModel extends mongoose.Model<UserDoc> {
	build(attr: UserAttr): UserDoc;
}

const userSchema = new mongoose.Schema(
	{
		email: { type: String, required: true },
		password: { type: String, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		IDNumber: { type: Number, required: true },
		dateOfBirth: { type: Date, required: true },
		phoneNumber: { type: Number, required: true },
		createdAt: { type: Date, required: true, default: Date.now },
		passwordLastUpdatedAt: { type: Date, required: false },
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.password;
				delete ret.__v;
			},
		},
		timestamps: { createdAt: false },
	}
);

userSchema.index({ email: 1 });
userSchema.set("versionKey", "version");

userSchema.virtual("fullName").get(function (this: UserDoc) {
	return `${this.firstName} ${this.lastName}`;
});

userSchema.statics.build = (attrs: UserAttr) => {
	return new User(attrs);
};

userSchema.pre("save", async function (this: UserDoc, done) {
	if (this.isModified("password")) {
		const hashed = await Password.toHash(this.get("password"));
		this.set("password", hashed);
	}

	done();
});

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
