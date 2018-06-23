const db = require("../models");
const moment = require("moment");

function formatArticles(data) {
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
    return articles;
}

function addPages(pageArray, currentPage, startIndex, endIndex) {
    for (let i = startIndex; i <= endIndex; i++) {
        if (i > 0) {
            const displayPage = {};
            displayPage.pageNumber = i;
            displayPage.isCurrentPage = i === currentPage;
            pageArray.push(displayPage);
        }
    }
}

module.exports = (app) => {
    app.get("/", (req, res) => res.redirect("/page?p=1"));

    app.get("/bookmarks", (req, res) => {
        db.Article.find({})
            .populate({ path: "comments", options: { sort: { date: -1 } } })
            .populate("blog")
            .then((data) => {
                const articles = formatArticles(data);
                res.render("index", {
                    articles,
                    bookmarks: true,
                    currentPage: "/bookmarks",
                });
            })
            .catch(dbErr => res.json(dbErr));
    });

    app.get("/page", (req, res) => {
        const perPage = 9;
        const pageNumString = req.query.p || "1";
        const page = parseInt(pageNumString, 10);
        db.Article.find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .populate({ path: "comments", options: { sort: { date: -1 } } })
            .populate("blog")
            .then(data => db.Article.count()
                .then((articleCount) => {
                    const articles = formatArticles(data);
                    const totalPages = Math.ceil(articleCount / perPage);
                    const pages = [];
                    if (page <= 3) {
                        const minPages = totalPages < 5 ? totalPages : 5;
                        addPages(pages, page, 1, minPages);
                    } else if (totalPages - page < 2) {
                        addPages(pages, page, totalPages - 4, totalPages);
                    } else {
                        addPages(pages, page, page - 2, page + 2);
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
                        currentPage: `/page?p=${page}`,
                    });
                }))
            .catch(dbErr => res.json(dbErr));
    });
};
