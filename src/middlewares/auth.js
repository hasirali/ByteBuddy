const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        // Reading and validating
        const cookies = req.cookies;
        const { token } = cookies;

        if (!token) {
            return res.status(401).send("Token not provided");
        }

        const decodedObj = jwt.verify(token, "SecretKey@boss"); 
        const { _id } = decodedObj;

        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
};

module.exports = userAuth;
