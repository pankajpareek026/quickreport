import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: [true, "username already exists"],
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: [true, "email already exists"],
            lowecase: true,
            trim: true,
        },
        name: {
            type: String,
            required: [true, "name is required"],
            trim: true,
            index: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        password: {
            type: String,
            min: [8, "password must be at least 8 characters"],
            required: [true, 'Password is required']
        },
        joiningDate: {
            type: BigInt,
            default: Date.now()
        }


    },
    {
        timestamps: true
    }
)

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}
const UserModel = mongoose.model("user", userSchema);
export { UserModel };