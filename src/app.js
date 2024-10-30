const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require('./models/user');

app.use(express.json());

// Signup
app.post('/signup', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save();
        res.send("User added Succesfully");
    }
    catch (err) {
        res.status(400).send("error Saviubng to database" + err.message);
    }
})
// get User by Email
app.get("/user", async (req,res)=>{
    const userEmail = req.body.emailId;

    try{
        const users = await User.find({emailId : userEmail })
        if(users.length === 0){
            return res.status(404).send("User not found with that email");
        }
        else{
            res.send(users)
        }
    }
    catch(err){
        res.status(400).send("Kuch to gadbad hai daya"+err.message);
    }
    
})

// Get All User
app.get("/feed", async (req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        res.send("Error fetching users"+err.message);
    }
})

// Delete a User
app.delete("/user",async (req,res)=>{
    const userId = req.body.userId
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }
    catch(err){
        res.send("Error deleting user"+err.message);
    }
})

// Update User
app.patch("/user", async (req,res)=>{

    const userId = req.body.userId;
    const data = req.body;
    try{
        await User.findByIdAndUpdate({_id:userId},data)
        res.send("User updated successfully");
    }
    catch(err){
        res.send("Error updating user"+err.message);
    }
})


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
