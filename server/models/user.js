const mongoose = require("mongoose")

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {type: String, minLength: 3, req: true},
    password: {type: String, required: true},
    about: {type: String, minLength: 5, maxLength: 50},
    avatar: {type: Buffer},
    friends: [{friendId: {type: String}, status: {type: String, enum: ["sent_to, sent_from, true"]}}]
})

module.exports = mongoose.model("User", userSchema)