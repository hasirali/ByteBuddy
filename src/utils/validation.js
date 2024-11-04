const validator = require('validator');

const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    // Validate first name
    if (!firstName || typeof firstName !== 'string') {
        throw new Error("First Name is mandatory and must be a string");
    } else if (firstName.length < 1 || firstName.length > 50) {
        throw new Error("First Name should be between 1 and 50 characters");
    }

    // Validate last name
    if (!lastName || typeof lastName !== 'string') {
        throw new Error("Last Name is mandatory and must be a string");
    } else if (lastName.length < 1 || lastName.length > 50) {
        throw new Error("Last Name should be between 1 and 50 characters");
    }

    // Validate email
    if (!emailId || typeof emailId !== 'string') {
        throw new Error("Email is mandatory and must be a string");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Email");
    }

    // Validate password
    if (!password || typeof password !== 'string') {
        throw new Error("Password is mandatory and must be a string");
    } else if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        throw new Error("Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character");
    }
};

const validateProfileEditData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "emailId", "photoUrl", "gender", "age", "skills", "about"];

    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));

    return isEditAllowed ;
};

module.exports = { validateSignupData, validateProfileEditData };
