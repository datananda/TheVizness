const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    name: {
        type: String,
        required: "blog name is required",
    },
    url: {
        type: String,
    },
    icon: {
        type: String,
    },
    articleSelector: {
        type: String,
    },
    headlineSelector: {
        type: String,
    },
    urlSelector: {
        type: String,
    },
    summarySelector: {
        type: String,
    },
    articles: [{
        type: Schema.Types.ObjectId,
        ref: "Article",
    }],
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
