const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    comment: {
        type: String,
        required: "comment text is required",
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
