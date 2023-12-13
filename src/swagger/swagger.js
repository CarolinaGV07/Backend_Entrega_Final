import swaggerJsdoc from "swagger-jsdoc";
import __dirname from "../utils.js";
export const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion ejercicio 20",
      description: "Documentacion ejercicio 20",
    },
  },
  apis: [__dirname + "/swagger/docs/**/*.yaml"],
};

export const specs = swaggerJsdoc(swaggerOptions);
