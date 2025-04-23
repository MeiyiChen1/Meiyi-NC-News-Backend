const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, createArticleLookupObj } = require("./utils");

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
            description VARCHAR(300) NOT NULL,
            img_url VARCHAR(1000));`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users(
            username VARCHAR(80) PRIMARY KEY NOT NULL UNIQUE,
            name VARCHAR(100) NOT NULL,
            avatar_url VARCHAR(1000) NOT NULL);`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles(
            article_id SERIAL PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            topic VARCHAR(1000) REFERENCES topics(slug),
            author VARCHAR(100) REFERENCES users(username),
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
              votes INT DEFAULT 0,
              author VARCHAR(100) REFERENCES users(username),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
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
        const convertedArticle = convertTimestampToDate(article);

        return [
          convertedArticle.title,
          convertedArticle.topic,
          convertedArticle.author,
          convertedArticle.body,
          convertedArticle.created_at,
          convertedArticle.votes,
          convertedArticle.article_img_url,
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
    })
    .then((result) => {
      //array of object transform into nested arrays
      const articlesLookup = createArticleLookupObj(result.rows);
      const formattedComments = commentData.map((comment) => {
        const convertedComment = convertTimestampToDate(comment);
        return [
          articlesLookup[convertedComment.article_title],
          convertedComment.body,
          convertedComment.votes,
          convertedComment.author,
          convertedComment.created_at,
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
