# The Vizness

The Vizness provides all your data visualization news in a one-stop-shop. Snapshots of articles scraped from the most popular data viz blogs are shown and you can link out directly to the full articles. You can also leave comments and create personalized bookmarks to save articles you want to review later.

## Getting Started

### Prerequisites

To use this repo, you will first need to install [node](https://nodejs.org/en/) and [MongoDB](https://docs.mongodb.com/manual/installation/).

### Installing

1. Install the required node packages

```
npm install
```

2. Start mongod process from a command prompt and leave it running while you develop

```
mongod
```

3. Seed your blogs collection with documents by navigating to the models/seeds directory from a separate command prompt and running the following command:

```
mongoimport --db MongoNews --collection blogs --file blogs.json --jsonArray
```

4. Start your node server (or use nodemon)

```
node server.js
```

5. Open the site you have locally hosted and click the "Refresh Articles" button to add documents to the articles collection

## Built With

* [Express](https://expressjs.com/) - node.js routing
* [Cheerio](https://github.com/cheeriojs/cheerio) - web scraping
* [Handlebars](https://handlebarsjs.com/) - templating
* [MongoDB](https://www.mongodb.com/) - database
* [Mongoose](http://mongoosejs.com/) - database modeling
* [Spectre.css](https://picturepan2.github.io/spectre/index.html) - CSS framework
