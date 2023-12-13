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
  before(async function () {
    request = supertest("http://localhost:8080");
    token = generateToken();
  });
  it("Debería poder crear un producto de la ruta /api/product", async () => {
    const product = {
      title: "Limpieza facial profunda",
      description: "Atención manual",
      code: "ABC12346",
      price: 8000,
      status: true,
      stock: 9993,
      category: "bueno",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/e-commerce-react-pf.appspot.com/o/Limpieza%20facial%20profunda%20chica.jpeg?alt=media&token=f1b936fb-6217-4898-86f3-03eb5493325e",
      owner: "adminCoder@coder.com",
    };
    const response = await request
      .post("/api/products")
      .send(product)
      .set("Cookie", `keyCookieForJWT=${token}`);
    const product2 = response.body;
    expect(product2.title).to.eql(product.title);
    expect(product2.description).to.eql(product.description);
    expect(product2.stock).to.eql(product.stock);
    expect(product2.thumbnail).to.eql(product.thumbnail);
    expect(response.status).to.equal(201);
  }).timeout(8000);
  it("Debería devolver un producto por id /api/products/:pid", async () => {
    const response = await request
      .get("/api/products/650dfff661e1fd1dd7bb2c7e")
      .set("Cookie", `keyCookieForJWT=${token}`);
    expect(response.status).to.equal(200);
    expect(response.body.title).to.eql("Limpieza facial profunda actualizada");
  }).timeout(8000);
  it("Debería actualizar un producto por id /api/products/:pid", async () => {
    const product = {
      title: "Limpieza facial profunda actualizada",
      description: "Atención manual",
      code: "ABC1234",
      price: 8000,
      status: true,
      stock: 9993,
      category: "bueno",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/e-commerce-react-pf.appspot.com/o/Limpieza%20facial%20profunda%20chica.jpeg?alt=media&token=f1b936fb-6217-4898-86f3-03eb5493325e",
    };
    const response = await request
      .put("/api/products/650dfff661e1fd1dd7bb2c7e")
      .send(product)
      .set("Cookie", `keyCookieForJWT=${token}`);
    expect(response.status).to.equal(200);
    expect(response.body.title).to.eql("Limpieza facial profunda actualizada");
  }).timeout(8000);
});
