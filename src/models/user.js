const mongoose = require('mongoose');

// crating a Schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    emailId: String,
    password: String,
    
})
// creating a user mode
// mongoose.model("jo naam dena hai model ko", "aur uska format kaisa hoga[Schema that i will pass]")
const UserModel = mongoose.model("User",userSchema);

module.exports = UserModel