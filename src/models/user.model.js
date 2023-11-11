import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: string,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, //cloudinary url
            required: true
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, "Password is required"],
        }
        ,
        refreshToken: {
            type: String
        }

    }, {
    timestamps: true,
});

function hashText(text) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(text, salt, function (err, hash) {
            if (!err)
                return hash;
        })
    });
}

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    // Hash the password
    this.password = hashText(this.password);
    next();
});

userSchema.methods.isPasswordCorrect = function (password) {

    bcrypt.compare(password, this.password).then((err, res) => {
        if (!err)
            return res;
    });
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.REFRESH_TOKEN, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
}


export const user = mongoose.model("User", userSchema);