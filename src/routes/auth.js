const express = require('express');
const authRouter = express.Router();
const validateSignupData = require('../utils/validation');
const validator = require('validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');



// Signup 
authRouter.post('/signup', async (req, res) => {
    try {
        // 1. Validation of Data
        validateSignupData(req);
        // 2. Encypt the password
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 8)

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        })
        await user.save();
        res.send("User added Succesfully");
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

// login 
authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!validator.isEmail(emailId)) {
            return res.status(400).send("Invalid email format");
        }
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("User not found with that email");
        }

        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            // 1. Create a JWT token
            // 2. Add the token to cookie and send the reposnse back to the user(client)

            // 1. Create a JWT token
            // const token = await jwt.sign({ _id: user._id }, "SecretKey@boss",{expireIn:"7d",}) offloaded to user.js 
            const token = await user.getJWT();

            // 2.add token to cookie and send back
            res.cookie("token", token)


            res.send("Login Successfull");
        }
        else {
            res.status(400).send("Invalid Password");
        }
    }

    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})


module.exports = authRouter;