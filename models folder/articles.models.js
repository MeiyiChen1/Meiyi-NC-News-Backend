const db = require("../db/connection");

const selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found under article_id ${article_id}`,
        });
      }
      return rows[0];
    });
};

const selectArticles = (sort_by = "created_at", order = "desc") => {
  const sortFields = [
    "article_id",
    "title",
    "topics",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];
  const orderField = ["asc", "desc"];
  if (!sortFields.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sorting column" });
  }
  if (!orderField.includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order.toUpperCase()}`
    )
    .then(({ rows }) => {
      return rows;
    });
};

const updateArticleVotes = (inc_votes, article_id) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return rows[0];
    });
};
module.exports = { selectArticleById, selectArticles, updateArticleVotes };
