import { expect } from "chai";
import { generateToken } from "../utils.js";
import mongoose from "mongoose";
import app from "../app.js";
import config from "../config/config.js";
import supertest from "supertest";
let server;
let request;

describe("Pruebas de la API", () => {
  before(async function () {
    request = supertest("http://localhost:8080");
  });
  it("Debería devolver un error por mandar credenciales mal", async () => {
    const response = await request
      .post("/api/session/login")
      .send({ email: "adminCoder@coder.com", password: "adminCod3r1234" });
    expect(response.body).to.be.an("object");
    expect(response.body).to.have.property("error").that.is.a("string");
    expect(response.status).to.equal(500);
  }).timeout(8000);
  it("Debería loguear un usuario", async () => {
    const response = await request
      .post("/api/session/login")
      .send({ email: "adminCoder@coder.com", password: "adminCod3r123" });
    expect(response.status).to.equal(200);
  }).timeout(8000);
  it("Debería devolver un error al registrar un usuario que ya existe en /api/session/register", async () => {
    const user = {
      first_name: "Coder",
      last_name: "Admin",
      email: "adminCoder@coder.com",
      age: "21",
      password: "$2b$10$AGzCivuwoptmlE7E.9ldteEeYeUKJXzcLl7YO5Jhm/qPsby8VDw7G",
      rol: "admin",
      status: "verified",
      cartId: [],
      __v: 0,
    };
    const response = await request.post("/api/session/register").send(user);
    expect(response.body).to.be.an("object");
    expect(response.body).to.have.property("error").that.is.a("string");
    expect(response.status).to.equal(500);
  }).timeout(8000);
});
