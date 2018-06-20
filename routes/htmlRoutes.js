const db = require("../models");
const moment = require("moment");

module.exports = (app) => {
    // app.get("/", (req, res) => {
    //     db.Article.find({})
    //         .populate({ path: "comments", options: { sort: { date: -1 } } })
    //         .then((data) => {
    //             const formattedData = data.map((article) => {
    //                 const formattedArticle = article;
    //                 formattedArticle.numComments = article.comments.length;
    //                 const formattedComments = article.comments.map((comment) => {
    //                     const formattedComment = comment;
    //                     formattedComment.formattedDate = moment(comment.date).format("MMM D, YYYY [at] h:mm a");
    //                     return formattedComment;
    //                 });
    //                 formattedArticle.comments = formattedComments;
    //                 return article;
    //             });
    //             res.render("index", { articles: formattedData });
    //         })
    //         .catch(err => res.json(err));
    // });
    app.post("/bookmarks", (req, res) => {
        // console.log(req.body);
        console.log(req.body);
        const bookmarks = req.body.bookmarks;
        console.log(bookmarks);
        db.Article.find({ _id: { $in: bookmarks } })
            .populate("comments")
            .then((data) => {
                const articles = data.map((article) => {
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
                console.log(articles);
                res.json("hello world");
                // res.render("index", {
                //     articles,
                // });
            });
    });

    app.get("/page/:page", (req, res) => {
        const perPage = 9;
        const page = parseInt(req.params.page, 10);
        db.Article.find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .populate({ path: "comments", options: { sort: { date: -1 } } })
            .then(data => db.Article.count()
                .then((articleCount) => {
                    const articles = data.map((article) => {
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
                    const totalPages = Math.ceil(articleCount / perPage);
                    const pages = [];
                    if (page <= 3) {
                        const minPages = totalPages < 5 ? totalPages : 5;
                        for (let i = 1; i <= minPages; i++) {
                            const displayPage = {};
                            displayPage.pageNumber = i;
                            displayPage.isCurrentPage = i === page;
                            pages.push(displayPage);
                        }
                    }
                    const pagination = {
                        firstPage: {
                            isCurrentPage: page === 1,
                        },
                        prevPage: {
                            id: page - 1,
                        },
                        nextPage: {
                            id: page + 1,
                        },
                        lastPage: {
                            isCurrentPage: page === totalPages,
                            id: totalPages,
                        },
                        pages,
                    };
                    res.render("index", {
                        articles,
                        pagination,
                    });
                }))
            .catch(dbErr => res.json(dbErr));
    });
};
