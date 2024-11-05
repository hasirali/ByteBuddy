const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../middlewares/auth');
const { validateProfileEditData ,validateSignupData} = require('../utils/validation'); // Ensure both functions are exported

// Fetch a Single Profile
profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("Invalid Token");
    }
});

// Edit Profile
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid Edit Fields");
        }
        const loggedInUser = req.user;
        
        // Update the user object with the provided fields
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });

        // Save the updated user
        await loggedInUser.save();

        // Respond with the updated user data
        res.send( "Profile updated successfully." );
    } catch (err) {
        console.error(err); 
        res.status(400).send("Invalid Data: " + err.message);
    }
});



module.exports = profileRouter;
