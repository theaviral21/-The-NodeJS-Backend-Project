
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpiry: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
   
});

const User = mongoose.model("User", UserSchema);

export default User;

