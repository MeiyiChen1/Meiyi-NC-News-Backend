const express = require("express");
const app = express();
const db = require("./db/connection");
const getApi = require("./controllers folder/api.controllers");
const { getTopics } = require("./controllers folder/topics.controllers");
const {
  getArticleById,
  getArticles,
  patchArticleVotes,
} = require("./controllers folder/articles.controllers");

const {
  getCommentsByArticleId,
  postComment,
  handleDeleteComment,
} = require("./controllers folder/comments.controllers");

const { getUsers } = require("./controllers folder/users.controllers");
const cors = require("cors");

app.use(cors());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.get("/api/users", getUsers);

app.use(express.json());

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", handleDeleteComment);

app.all("/*splat", (req, res, next) => {
  next({ status: 404, msg: "Not found" });
});
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  }
});

module.exports = app;
