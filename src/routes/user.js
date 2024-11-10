const express = require('express');
const userRouter = express.Router();
const userAuth = require('../middlewares/auth')
const connectionRequestModel = require('../models/connectionRequest');
const { connection } = require('mongoose');
const UserModel = require('../models/user');


// api to get all the pending requests of a loggedInUser user[working]
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        // this will give all the requests that are sent to loggedInUser as well as who ignred loggedinIn User so we have to filter only pending request
        // const connectionRequests = await connectionRequestModel.find({
        //     toUserId:loggedInUser._id,
        // }) So we do


        const connectionRequests = await connectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "bio", "skills"]);
        res.json({
            message: "data Fetched Successfully",
            data: connectionRequests
        })
    }
    catch (err) {
        res.status(404).send("Error fetching requests" + err.message);
    }
})

// api to get all the connection [working]
userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await connectionRequestModel.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ]
        }).populate("fromUserId", "firstName lastName photoUrl about skills")

        const data = connections.map((e) => {
            return e.fromUserId;
        })
        res.json({
            message: "data Fetched Successfully",
            data
        })

    }
    catch (err) {
        res.status(404).send("Error fetching connections" + err.message);
    }
})

// api to build feed page
userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        // pagination formual and stuffs
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10; // limit is initially defined as a const, which doesn’t allow reassignment.
        limit = limit > 50 ? 50 : limit; // limit the number of post to 50
        const skip = (page-1)*limit; 
        // not seeing my own Profile(Card)
        // not seeing the post of the user i already send intreseted or ignored
        // not seeing the post of the user who i have already connected
        const loggedInUser = req.user
        // find all connection requsest sent or received 
        const connectionRequests = await connectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")  // these are the users who are already connected or sent request to or received request from
        // .populate("fromUserId", "firstName")
        // .populate("toUserId", "firstName ")
        // so i will hide these user from feed
        const hideUserFromFeed = new Set();
        connectionRequests.forEach((e)=>{
            hideUserFromFeed.add(e.fromUserId.toString())
            hideUserFromFeed.add(e.toUserId.toString())
        })
        // console.log(hideUserFromFeed);

        // find all the users who are not in the hideUserFromFeed sd
        const user = await UserModel.find({
          $and: [ 
            { _id: {$nin: Array.from(hideUserFromFeed)}} ,  //id is NotIn the array hideUserFromFeed
            { _id: {$ne: loggedInUser._id}} // id is not equal to loggedInUser
        ],
        }).select("firstName lastName photoUrl bio skills").skip(skip).limit(limit)
        res.json({
            message: "data Fetched Successfully",
            data: user,
        })
    }






    catch (err) {
        res.status(404).send("Error fetching feed" + err.message);
    }
})

module.exports = userRouter;