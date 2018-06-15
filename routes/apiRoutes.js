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
                                .then((newDoc) => {
                                    console.log(newDoc);
                                })
                                .catch(dbErr => res.json(dbErr));
                        }
                    })
                    .catch(dbErr => res.json(dbErr));
            });
        });
        res.send("Done");
    });
};
