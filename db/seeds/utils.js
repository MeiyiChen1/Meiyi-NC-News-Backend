const db = require("../../db/connection");
const { articleData } = require("../data/test-data");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createArticleLookupObj = (articleData) => {
  if (articleData.length === 0) {
    return {};
  }
  const lookupObj = {};
  articleData.forEach((article) => {
    lookupObj[article.title] = article.article_id;
  });

  return lookupObj;
};
