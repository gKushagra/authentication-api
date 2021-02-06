const { describe } = require("mocha");
var request = require("supertest");
var app = require("./../server");

describe("GET /test", function () {
  it("respond with welcome message", function (done) {
    // navigate to /test and check response has welcome message
    request(app)
      .get("/test")
      .expect(
        'Hi! You have called OddFellow SSO REST API Test endpoint. <a href="https://sso.oddfellow.in">Visit Website</a>',
        done
      );
  });
});
