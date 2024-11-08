const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// crating a Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true, // Removes extra spaces at the start or end
    },

    lastName: {
        type: String,
        trim: true,
        default: "", // Optional last name, default as empty string
    },

    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            // Simple regex for basic email validation
            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!emailRegex.test(value)) {
                throw new Error("Invalid email format");
            }
        },
    },

    age: {
        type: Number,
        min: 0, // Ensures age cannot be negative
        validate(value) {
            if (!Number.isInteger(value)) {
                throw new Error("Age must be an integer");
            }
        },
    },

    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum length for password
    },

    gender: {
        type: String,
        enum: ["male", "female"], // Ensures gender is either 'male' or 'female'
    },

    photoUrl: {
        type: String,
        default: "https://ohmylens.com/wp-content/uploads/2017/06/dummy-profile-pic.png",
        validate(value) {
            // Basic URL validation
            const urlRegex = /^(http|https):\/\/[^\s$.?#].[^\s]*$/;
            if (!urlRegex.test(value)) {
                throw new Error("Invalid URL format for photo");
            }
        },
    },

    about: {
        type: String,
        maxlength: 150, // Optional character limit for about section
    },

    skills: {
        type: [String],
    }

}, {
    timestamps: true,
})

// Define methods on the schema
userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "SecretKey@boss", { expiresIn: "7d" });
    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
};

// creating a user mode
// mongoose.model("jo naam dena hai model ko", "aur uska format kaisa hoga[Schema that i will pass]")
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel