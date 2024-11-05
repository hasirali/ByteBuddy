const express = require('express');
const requestRouter = express.Router(); 
const userAuth = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/ConnectionRequest'); // Import your model

// Sending Connection Request
requestRouter.post('/request/send/:status/:touserId',
    userAuth,
    async (req, res) => {
        try {
            const fromUserId = req.user; // ID of the user sending the request
            const toUserId = req.params.touserId; // ID of the user receiving the request
            const status = req.params.status; // Status of the request


            const connectionRequest = new ConnectionRequestModel({
                fromUserId,
                toUserId,
                status,
            });
            const data = await connectionRequest.save(); 

            console.log(`${req.user.firstName} request sent`);
            res.json({
                message: "Connection Request sent successfully",
                data,
            });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ error: "ERROR: " + err.message });
        }
    });

module.exports = requestRouter;
