const express = require('express');
const userRouter = express.Router();
const userAuth = require('../middlewares/auth')
const connectionRequestModel = require('../models/connectionRequest')


// api to get all the pending requests of a loggedInUser user
userRouter.get('/user/requests/received' , userAuth ,async (req,res)=>{
    try{
        const loggedInUser= req.user;

        // this will give all the requests that are sent to loggedInUser as well as who ignred loggedinIn User so we have to filter only pending request
        // const connectionRequests = await connectionRequestModel.find({
        //     toUserId:loggedInUser._id,
        // }) So we do
       

        const connectionRequests = await connectionRequestModel.find({
            toUserId:loggedInUser._id,
            status:"interested",
        }).populate("fromUserId" , ["firstName","lastName","photoUrl"]); 
        res.json({
            message:"data Fetched Successfully",
            data:connectionRequests
        })
    }
    catch(err){
        res.status(404).send("Error fetching requests" + err.message);
    }
})

module.exports = userRouter;