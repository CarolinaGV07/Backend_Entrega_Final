import { expect } from "chai";
import { generateToken } from "../utils.js";
import mongoose from "mongoose";
import app from "../app.js";
import config from "../config/config.js";
import supertest from "supertest";
let server;
let request;
let token;

describe("Pruebas de la API", () => {
  before(async function () {    request = supertest("http://localhost:8080");
    token = generateToken();
  });
  it("Debería poder crear un carrito de la ruta api/cart", async () => {
    const response = await request
      .post("/api/cart")
      .set("Cookie", `keyCookieForJWT=${token}`);
    expect(response.body.products).to.be.an("array").that.is.empty;
    expect(response.status).to.equal(200);
  }).timeout(8000);
  it("Deberia poder devolver el carrito de un usuario pasandole el id /api/cart", async () => {
    const response = await request
      .get("/api/cart/65358258acbbd858b0419668")
      .set("Cookie", `keyCookieForJWT=${token}`);
    expect(response.status).to.equal(200);
  });
  it("Le pasamos un ID que no existe y no debería de devolver un carrito /api/cart/:cid", async () => {
    const response = await request
      .get("/api/cart/6525f5c51c9f1291cae6510213")
      .set("Cookie", `keyCookieForJWT=${token}`);
    expect(response.body).to.be.an("object");
    expect(response.body).to.have.property("error").that.is.a("string");
    expect(response.status).to.equal(500);
  });
});
