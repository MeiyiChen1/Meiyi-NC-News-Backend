const db = require("../db/connection");

const selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    // if (rows.length === 0) {
    //   return Promise.reject({ status: 404, msg: "Not a valid path" });
    // }
    return rows;
  });
};

module.exports = selectTopics;
