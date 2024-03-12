const mongoose = require("mongoose")

const Schema = mongoose.Schema

const postSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    content: {type: String, maxLength: 50, minLength: 3, required: true},
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    likes: {type: Number, required: true, default: 0},
    datecreated: {type: Number, default: Date.now}
})

module.exports = mongoose.model("Post", postSchema)