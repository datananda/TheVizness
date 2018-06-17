const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    headline: {
        type: String,
        required: "article headline is required",
    },
    summary: {
        type: String,
    },
    url: {
        type: String,
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment",
    }],
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
