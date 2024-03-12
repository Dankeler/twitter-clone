const mongoose = require("mongoose")

const Schema = mongoose.Schema

const commentSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: "User", minLength: 3, required: true},
    content: {type: String, maxLength: 50, minLength: 3, required: true},
    likes: {type: Number, default: 0},
    datecreated: {type: Number, default: Date.now}
})

module.exports = mongoose.model("Comment", commentSchema)