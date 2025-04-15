const db = require("../connection");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments`).then(() => {
    return db.query(`DROP TABLE IF EXISTS articles`).then(() => {
      return db
        .query(`DROP TABLE IF EXISTS users`)
        .then(() => {
          return db.query(`DROP TABLE IF EXISTS topics`);
        })
        .then(() => {
          return db.query(`CREATE TABLE topics(
            slug VARCHAR(100) PRIMARY KEY,
            description VARCHAR(100),
            img_url VARCHAR(1000))`);
        })
        .then(() => {
          return db.query(`CREATE TABLE users(
            username VARCHAR(80) PRIMARY KEY,
            name VARCHAR(80),
            avatar_url VARCHAR(1000))`);
        });
    });
  }); //<< write your first query in here.
};

const format = require("pg-format");
module.exports = seed;

//topics, users, articles, and comments tables
