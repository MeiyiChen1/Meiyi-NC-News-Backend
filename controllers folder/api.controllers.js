const endpointsJson = require("../endpoints.json");

const getApi = (request, response) => {
  response.status(200).send({ endpoints: endpointsJson });
};

module.exports = getApi;
