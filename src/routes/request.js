const express = require('express');
const requestRouter = express.Router(); // Correct naming
const userAuth = require('../middlewares/auth');

// Sending Connection Request
requestRouter.post('/sendConnectionRequest', userAuth, async (req, res) => {
    // Sending a connection request
    const user = req.user;
    console.log(`${user.firstName} request sent`);
    res.send("Connection Request Sent");
});

module.exports = requestRouter;
