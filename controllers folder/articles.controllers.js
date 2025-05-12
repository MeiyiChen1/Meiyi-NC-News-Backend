const {
  selectArticleById,
  selectArticles,
  updateArticleVotes,
} = require("../models folder/articles.models");

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (isNaN(Number(article_id))) {
    return res.status(400).json({ msg: "Invalid article ID" });
  }
  if (!req.body || typeof inc_votes !== "number") {
    return res.status(400).json({
      msg: "Invalid request when requires { inc_votes: number }",
    });
  }
  updateArticleVotes(inc_votes, article_id)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticleById, getArticles, patchArticleVotes };
