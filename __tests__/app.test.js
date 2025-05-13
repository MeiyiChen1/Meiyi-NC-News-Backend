const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});
describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: response with all topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
  test("404: non-existent route", () => {
    return request(app)
      .get("/api/topikz")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("200: responds with corresponding article for requested id", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(3);
        expect(body.article.title).toBe(
          "Eight pug gifs that remind me of mitch"
        );
        expect(body.article.topic).toBe("mitch");
        expect(body.article.author).toBe("icellusedkars");
        expect(body.article.body).toBe("some gifs");
        expect(body.article.created_at).toBe("2020-11-03T09:12:00.000Z");
        expect(body.article.votes).toBe(0);
        expect(body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("404: when pass valid article_id but does not existence", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found under article_id 1000");
      });
  });
  test("400: bad request when pass invalid article_id", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: response with array of articles objects with correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);

        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("200: if sort_by query is created_at and is sort by date descending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBeGreaterThan(0);
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: response with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            article_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("200: if sort_by query is created_at and is sort by date descending", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBeGreaterThan(0);
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("404: when pass valid article_id but does not existence", () => {
    return request(app)
      .get("/api/articles/1999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found under article_id 1999");
      });
  });
  test("400: bad request when pass invalid article_id", () => {
    return request(app)
      .get("/api/articles/not-a-num/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments ", () => {
  test("201: should create a new comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "a new comment" })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: 1,
          username: "butter_bridge",
          body: "a new comment",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("400: if missing username", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ body: "a new comment" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing request information");
      });
  });
  test("400:if missing body", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing request information");
      });
  });
  test("404: if article does not exist", () => {
    return request(app)
      .post("/api/articles/999/comments")
      .send({ username: "butter_bridge", body: "new comment" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("404: if username does not exist", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "wrong_user", body: "new comment" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("200: update an article and responds with the updated article", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 17 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle).toMatchObject({
          article_id: 3,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 17,
          article_img_url: expect.any(String),
        });
      });
  });
  test("400: returns bad request when article_id is invalid", () => {
    return request(app)
      .patch("/api/articles/banana")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article ID");
      });
  });
  test("400: returns bad request when inc_votes is invalid data type", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "not-number" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Invalid request when requires { inc_votes: number }"
        );
      });
  });
  test("400: returns bad request when passed an empty object", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Invalid request when requires { inc_votes: number }"
        );
      });
  });
  test("404: returns not found when pass non existence article_id", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204:delete the comment by comment_id", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return db.query("SELECT * FROM comments WHERE comment_id = $1", [1]);
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(0);
      });
  });
  test("400:invalid comment_id when request with non-number", () => {
    return request(app)
      .delete("/api/comments/abanana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid comment ID format");
      });
  });
  test("400:invalid comment_id when request with negative number", () => {
    return request(app)
      .delete("/api/comments/-1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid comment ID format");
      });
  });
  test("404: non existent comment", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
});
