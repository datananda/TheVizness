const db = require("../models");
const moment = require("moment");

module.exports = (app) => {
    app.get("/", (req, res) => {
        db.Article.find({})
            .populate({ path: "comments", options: { sort: { date: -1 } } })
            .then((data) => {
                const formattedData = data.map((article) => {
                    const formattedArticle = article;
                    formattedArticle.numComments = article.comments.length;
                    const formattedComments = article.comments.map((comment) => {
                        const formattedComment = comment;
                        formattedComment.formattedDate = moment(comment.date).format("MMM D, YYYY [at] h:mm a");
                        return formattedComment;
                    });
                    formattedArticle.comments = formattedComments;
                    return article;
                });
                res.render("index", { articles: formattedData });
            })
            .catch(err => res.json(err));
    });
};
