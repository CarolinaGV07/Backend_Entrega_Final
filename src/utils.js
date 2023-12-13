import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

export const generateToken = (user) => {
  return jwt.sign({ user }, "secretForJWT", { expiresIn: "24h" });
};

// JWT Extraemos el token del header
export const authToken = (req, res, next) => {
  // Buscamos el token en el header o en la cookie
  let authHeader = req.headers.auth;
  if (!authHeader) {
    authHeader = req.cookies["keyCookieForJWT"];
    if (!authHeader) {
      return res.status(401).send({
        error: "Not auth",
      });
    }
  }

  // Verificamos y desencriptamos la informacion
  const token = authHeader;
  jwt.verify(token, "secretForJWT", (error, credentials) => {
    if (error) return res.status(403).send({ error: "Not authroized" });

    req.user = credentials.user;
    next();
  });
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res.status(401).send({
          error: info.messages ? info.messages : info.toString(),
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (role) => {
  return async (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).send({ error: "Unauthorized" });
    if (user.user.role != role)
      return res.status(403).send({ error: "No permission" });
    return next();
  };
};

export const generateProducts = () => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    thumbnail: faker.image.imageUrl(),
    stock: faker.datatype.number(),
    id: faker.database.mongodbObjectId(),
    status: "true",
    code: faker.datatype.number(),
  };
};

export default __dirname;
