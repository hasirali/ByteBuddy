const express = require('express');
const connectDB = require("./config/database");
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const User = require('./models/user');
// const validateSignupData = require('./utils/validation');
// const validator = require('validator');
// const userAuth = require('./middlewares/auth');


// Middleware
app.use(express.json()); 
app.use(cookieParser());
app.use(express.json());


const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request'); 
const userRouter = require('./routes/user'); 

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);




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
