const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require('./models/user');
const validateSignupData = require('./utils/validation');
const bcrypt = require('bcrypt');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userAuth = require('./middlewares/auth');

// Middleware
app.use(express.json());
app.use(cookieParser());
// 
// 







// Signup 
app.post('/signup', async (req, res) => {
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

// fetch a Single Profile
app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    }
    
    catch (err) {
    res.status(400).send("Invalid Token")
}

})

// login 
app.post('/login', async (req, res) => {
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

app.post('/sendConnectionRequest', userAuth, async (req, res) => {
    // sending a connection request
    const user = req.user;
    console.log(user.firstName+"request send");
    res.send("Connection Request Sent");
});

























// // get User by Email
// app.get("/user", async (req, res) => {
//     const userEmail = req.body.emailId;

//     try {
//         const users = await User.find({ emailId: userEmail })
//         if (users.length === 0) {
//             return res.status(404).send("User not found with that email");
//         }
//         else {
//             res.send(users)
//         }
//     }
//     catch (err) {
//         res.status(400).send("Kuch to gadbad hai daya" + err.message);
//     }

// })

// // Get All User
// app.get("/feed", async (req, res) => {
//     try {
//         const users = await User.find({});
//         res.send(users);
//     }
//     catch (err) {
//         res.send("Error fetching users" + err.message);
//     }
// })

// // Delete a User
// app.delete("/user", async (req, res) => {
//     const userId = req.body.userId
//     try {
//         const user = await User.findByIdAndDelete(userId);
//         res.send("User deleted successfully");
//     }
//     catch (err) {
//         res.send("Error deleting user" + err.message);
//     }
// })

// // Update User
// app.patch("/user/:userId", async (req, res) => {
//     const userId = req.params?.userId;
//     const data = req.body;
//     try {
//         const ALLOWED_UPDATES = ["userId", "photoUrl", "password", "about", "age", "skills"];

//         const isUpdateAllowed = Object.keys(data).every((k) => {
//             return ALLOWED_UPDATES.includes(k);
//         });
//         if (!isUpdateAllowed) {
//             return res.status(400).send("Canlt update these fields");
//         }
//         const user = await User.findByIdAndUpdate(userId, data, {
//             new: true, // Use 'new: true' to return the updated document
//             runValidators: true,
//         });

//         if (!user) {
//             return res.status(404).send("User not found");
//         }

//         res.send("User updated successfully");
//     } catch (err) {
//         res.status(400).send("Error updating user: " + err.message);
//     }
// });


connectDB()
    .then(() => {
        console.log("Connected to the database");
        app.listen(3000, () => {
            console.log('Server is running on port 3000..badshah bhaisaab');
        })
    })
    .catch((err) => {
        console.error("Error connecting to the database", err);
    });
