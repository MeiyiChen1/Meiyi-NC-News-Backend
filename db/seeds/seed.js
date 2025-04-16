const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, createRef } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`);
    })
    .then(() => {
      return db.query(`CREATE TABLE topics(
            slug VARCHAR(100) PRIMARY KEY,
            description VARCHAR(100),
            img_url VARCHAR(1000));`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users(
            username VARCHAR(80) PRIMARY KEY,
            name VARCHAR(80) NOT NULL,
            avatar_url VARCHAR(1000));`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles(
            article_id SERIAL PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            topic VARCHAR(1000) REFERENCES topics(slug) NOT NULL,
            author VARCHAR(100) REFERENCES users(username) NOT NULL,
            body TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            votes INT DEFAULT 0,
            article_img_url VARCHAR(1000));`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments(
              comment_id SERIAL PRIMARY KEY,
              article_id INT REFERENCES articles(article_id),
              body TEXT NOT NULL,
              author VARCHAR(100) REFERENCES users(username),
              votes INT DEFAULT 0,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`);
    })
    .then(() => {
      //array of object transform into nested arrays
      const formattedTopics = topicData.map((topic) => {
        return [topic.slug, topic.description, topic.img_url];
      });
      //use pg format to insert the query
      const insertTopicsQueryString = format(
        `INSERT INTO topics
        (slug, description, img_url)
        VALUES
        %L
        RETURNING *;`,
        formattedTopics
      );
      // //return db.query
      return db.query(insertTopicsQueryString);
    })
    .then(() => {
      //array of object transform into nested arrays
      const formattedUsers = userData.map((user) => {
        return [user.username, user.name, user.avatar_url];
      });
      //use pg format to insert the query
      const insertUsersQueryString = format(
        `INSERT INTO users
      (username, name, avatar_url)
      VALUES
      %L
      RETURNING *;`,
        formattedUsers
      );
      // //return db.query
      return db.query(insertUsersQueryString);
    })
    .then(() => {
      //array of object transform into nested arrays
      const formattedArticles = articleData.map((article) => {
        const formattedArticle = convertTimestampToDate(article);

        return [
          article.title,
          article.topic,
          article.author,
          article.body,
          formattedArticle.created_at,
          article.votes,
          article.article_img_url,
        ];
      });
      //use pg format to insert the query
      const insertArticlesQueryString = format(
        `INSERT INTO articles
      (title, topic, author, body, created_at, votes, article_img_url)
      VALUES
      %L
      RETURNING *;`,
        formattedArticles
      );
      // //return db.query
      return db.query(insertArticlesQueryString);
    });
  // .then((result) => {
  //   //array of object transform into nested arrays
  //   const articlesRefObject = createRef(result, rows);
  //   const formattedComments = commentData.map((comment) => {
  //     const formattedComment = convertTimestampToDate(comment);

        return [
          articlesRefObject[comment.article_title],
          formattedComment.body,
          formattedComment.votes,
          formattedComment.author,
          formattedComment.created_at,
        ];
      });
      //use pg format to insert the query
      const insertCommentsQueryString = format(
        `INSERT INTO comments
      (article_id, body, votes, author, created_at)
      VALUES
      %L
      RETURNING *;`,
        formattedComments
      );
      // //return db.query
      return db.query(insertCommentsQueryString);
    });
};

module.exports = seed;
