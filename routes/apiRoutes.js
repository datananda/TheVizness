const request = require("request");
const cheerio = require("cheerio");

const db = require("../models");

module.exports = (app) => {
    app.get("/articles", (req, res) => {
        db.Blog.find({})
            .then((blogs) => {
                blogs.forEach((blog) => {
                    request(blog.articleUrl, (err, resp, html) => {
                        const $ = cheerio.load(html);
                        eval(blog.articleSelector).each((i, elem) => {
                            const newData = {};
                            newData.headline = eval(blog.headlineSelector);
                            newData.url = eval(blog.urlSelector);
                            newData.summary = eval(blog.summarySelector);
                            newData.blog = blog._id;
                            db.Article.findOne(newData)
                                .then((existingDoc) => {
                                    if (!existingDoc) {
                                        db.Article.create(newData)
                                            .then(newArticle => db.Blog.findOneAndUpdate(
                                                { _id: blog._id },
                                                { $push: { articles: newArticle._id } },
                                                { new: true },
                                            ))
                                            .then(updatedBlog => res.json(updatedBlog))
                                            .catch(dbErr => res.json(dbErr));
                                    }
                                });
                        });
                    });
                });
            });

        // request("http://susielu.com/", (err, resp, html) => {
        //     const $ = cheerio.load(html);
        //     $(".span-grid .activity-post").each((i, elem) => {
        //         const newData = {};
        //         newData.headline = $(elem).find(".title h2").text().trim();
        //         newData.url = $(elem).find("figure a").attr("href");
        //         newData.summary = $(elem).find(".title").next().children("p")
        //             .text();
        //         // newData.summary = $(elem).find(".entry p").map(function () { return $(this).text(); }).get()
        //             // .join(" ");
        //         console.log(newData);
        //         // db.Article.findOne(newData)
        //         //     .then((existingDoc) => {
        //         //         if (!existingDoc) {
        //         //             db.Article.create(newData)
        //         //                 .then()
        //         //                 // .then(newArticle => console.log(newArticle))
        //         //                 .catch(dbErr => res.json(dbErr));
        //         //         }
        //         //     })
        //         //     .catch(dbErr => res.json(dbErr));
        //     });
        // });
        res.redirect("/page?p=1");
    });

    app.post("/articles/:id", (req, res) => {
        db.Comment.create(req.body)
            .then(newComment => db.Article.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { comments: newComment._id } },
                { new: true },
            ).populate({ path: "comments", options: { sort: { date: -1 } } }))
            .then(updatedArticle => res.json(updatedArticle))
            .catch(dbErr => res.json(dbErr));
    });

    app.delete("/articles/:articleId/comments/:commentId", (req, res) => {
        db.Comment.findByIdAndRemove(req.params.commentId)
            .then(deletedComment => db.Article.findByIdAndUpdate(
                req.params.articleId,
                { $pull: { comments: deletedComment._id } },
            ).populate({ path: "comments", options: { sort: { date: -1 } } }))
            .then(updatedArticle => res.json(updatedArticle))
            .catch(dbErr => res.json(dbErr));
    });
};
