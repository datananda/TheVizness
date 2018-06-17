const request = require("request");
const cheerio = require("cheerio");

const db = require("../models");

module.exports = (app) => {
    app.get("/articles", (req, res) => {
        request("http://flowingdata.com/most-recent/", (err, resp, html) => {
            const $ = cheerio.load(html);
            $("#recent-posts .archive-post").each((i, elem) => {
                const newData = {};
                newData.headline = $(elem).children("h2").text().trim();
                newData.url = $(elem).find("h2 a").attr("href");
                let summary = "";
                $(elem).find(".entry p").each((j, p) => {
                    summary += ` ${$(p).text()}`;
                });
                newData.summary = summary;
                db.Article.findOne(newData)
                    .then((existingDoc) => {
                        if (!existingDoc) {
                            db.Article.create(newData)
                                .then(newArticle => console.log(newArticle))
                                .catch(dbErr => res.json(dbErr));
                        }
                    })
                    .catch(dbErr => res.json(dbErr));
            });
        });
        res.send("Done");
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
