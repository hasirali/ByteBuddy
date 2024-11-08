const express = require('express');
const requestRouter = express.Router();
const userAuth = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest'); // Import your model
const UserModel = require('../models/user');
const { connection } = require('mongoose');

// Sending Connection Request[Working]
requestRouter.post('/request/send/:status/:touserId',
    userAuth,
    async (req, res) => {
        try {
            const fromUserId = req.user; // ID of the user sending the request
            const toUserId = req.params.touserId; // ID of the user receiving the request
            const status = req.params.status; // Status of the request

            const allowedStatus = ["interested", "ignored"];
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({ error: "Invalid status" });
            }


            // check if a user is sending a request to himself
            if (fromUserId._id.toString() === toUserId.toString()) {
                return res.status(400).json({ error: "You cannot send a request to yourself" });
            }




            // check if ther toUserId is valid(mean real or fake)
            const toUser = await UserModel.findById(toUserId);
            if (!toUser) {
                return res.status(400).json({ error: "User Not Found" });
            }



            // check if there is already a pending request between the two users
            // also check if request is already sent by the other user to me(loggedIn user)
            const existingConnectionRequest = await ConnectionRequestModel.findOne({
                $or: [
                    // check if there is already a pending request between the two users
                    {
                        toUserId, fromUserId
                        // if toUseId and fromUserId already exist then we wont send req


                        // or
                        // toUserId: toUserId,
                        // fromUserId: fromUserId
                    },
                    // also check if request is already sent by the other user to me(loggedIn user)
                    {
                        toUserId: fromUserId,
                        fromUserId: toUserId
                    }
                ]
            })
            if (existingConnectionRequest) {
                return res.status(400).send({ message: "Request already sent" });
            }


            const connectionRequest = new ConnectionRequestModel({
                fromUserId,
                toUserId,
                status,
            });
            const data = await connectionRequest.save();

            console.log(`${req.user.firstName} request sent`);

            res.json({
                message: req.user.firstName + " is " + status + " in " + toUser.firstName,
                data,
            });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ error: "ERROR: " + err.message });
        }
    });


//Responding to Connection Request[Working]
requestRouter.post('/request/respond/:status/:requestId',
    userAuth,
    async (req, res) => {
        try {
            const loggedInUser = req.user;
            // const { status, requestId } = req.params;
            // or
            const requestId = req.params.requestId;
            const status = req.params.status;
            const allowedStatus = ["accepted", "rejected"];

            if (!allowedStatus.includes(status)) {
                return res.status(400).send({ message: "invalid status" });
            }

            const connectionRequest = await ConnectionRequestModel.findOne({
                _id: requestId,
                toUserId: loggedInUser._id,
                status: "interested",
            })
            // agar connectionRequest nahi mila toh
            if (!connectionRequest) {
                return res.status(400).json({ message: "Request not found" });
            }

            // if connectionRequest match
            connectionRequest.status = status;
            const data = await connectionRequest.save();
            res.send({ message: "Request" + status, data });

        }
        catch (err) { 
        res.status(400).json({ message: "Error: " + err.message });
        }
    })

module.exports = requestRouter;

