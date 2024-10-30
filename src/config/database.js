const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.connect('mongodb+srv://hasira804:1M5gi3g2heGJGurW@namastenode.wticc.mongodb.net/devTinder');
};

module.exports = connectDB;
