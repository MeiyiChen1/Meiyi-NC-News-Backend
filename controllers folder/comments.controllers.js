const {
  selectCommentsByArticleId,
  insertComment,
  deleteComment,
} = require("../models folder/comments.models");

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  if (!username || !body) {
    return res.status(400).send({
      msg: "Missing request information",
    });
  }
  insertComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

const handleDeleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  if (isNaN(Number(comment_id)) || Number(comment_id) <= 0) {
    return Promise.reject({
      status: 400,
      msg: "Invalid comment ID format",
    });
  }
  deleteComment(comment_id)
    .then((comment) => {
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found",
        });
      }
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getCommentsByArticleId, postComment, handleDeleteComment };
