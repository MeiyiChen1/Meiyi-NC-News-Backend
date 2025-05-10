const db = require("../db/connection");

const selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      "SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found under article_id ${article_id}`,
        });
      }
      return rows;
    });
};

const insertComment = (article_id, author, body) => {
  return db
    .query("SELECT 1 FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        throw { status: 404, msg: "Article not found" };
      }
      // Then check if user exists
      return db.query("SELECT 1 FROM users WHERE username = $1", [author]);
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        throw { status: 404, msg: "User not found" };
      }
      return db.query(
        `INSERT INTO comments (article_id, author, body)VALUES ($1, $2, $3)
      RETURNING comment_id, article_id, author AS username, body, votes, created_at`,
        [article_id, author, body]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
module.exports = { selectCommentsByArticleId, insertComment };
