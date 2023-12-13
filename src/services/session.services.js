import { createHash, isValidPassword } from "../utils.js";
import UserDTO from "../DTO/user.dto.js";
import CustomError from "../errors/CustomError.js";
import EErrors from "../errors/enums.js";
import { generateUserErrorInfo } from "../errors/info.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.USER,
    pass: config.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  }
});

export default class SessionServices {
  constructor(userDAO, cartDAO) {
    this.userDAO = userDAO;
    this.cartDAO = cartDAO;
  }

  async loginUser(user) {
    try {
      const userDB = await this.userDAO.getUserByEmail(user.email);
      if (!userDB) {
        CustomError.createError({
          name: "Error",
          message: "User not found by create error",
          code: EErrors.USER_NOT_FOUND,
          info: generateUserErrorInfo(user),
        });
      }
      if (!isValidPassword(userDB, user.password)) {
        CustomError.createError({
          name: "Error",
          message: "Password not valid",
          code: EErrors.PASSWORD_NOT_VALID,
          info: generateUserErrorInfo(user),
        });
      }
      return new UserDTO(userDB);
    } catch (e) {
      throw e;
    }
  }

  async registerUser(user) {
    if (await this.userDAO.getUserByEmail(user.email))
      CustomError.createError({
        name: "Error",
        message: "User already exist",
        code: EErrors.USER_ALREADY_EXISTS,
        info: generateUserErrorInfo(user.email),
      });
    user.password = createHash(user.password);
    if (user.email === "adminCoder@coder.com") {
      user.rol = "admin";
    } else {
      user.rol = "user";
    }
    const cart = await this.cartDAO.createCart();
    const newUser = await this.userDAO.createUser(user);
    newUser.cartId.push(cart._id);
    await this.userDAO.updateUser(newUser._id, newUser);
    return newUser;
  }

  async getUserCurrent(user) {
    return new UserDTO(user);
  }

  async getUserByEmail(email) {
    try {
      const user = await this.userDAO.getUserByEmail(email);
      if (!user) {
        CustomError.createError({
          name: "Error",
          message: "User not found by create error",
          code: EErrors.USER_NOT_FOUND,
          info: generateUserErrorInfo(user),
        });
      }
      return user;
    } catch (e) {
      throw e;
    }
  }

  async validUserSentEmailPassword(email) {
    const user = await this.userDAO.getUserByEmail(email);
    if (user) {
      const token = jwt.sign({ email }, "secret", { expiresIn: "1h" });
      const mailOptions = {
        from: config.USER,
        to: email,
        subject: "Restablecer tu contraseña",
        html: `Haz click en el siguiente link para restablecer tu contraseña: http://localhost:8080/api/session/resetPasswordForm/${token}`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw new Error("Error al enviar el mail");
      });
    }
    return user;
  }

  async resetPasswordForm(email, password, confirmPassword) {
    const user = await this.userDAO.getUserByEmail(email);
    if (!user) {
      CustomError.createError({
        name: "Error",
        message: "User not found by create error",
        code: EErrors.USER_NOT_FOUND,
        info: generateUserErrorInfo(user),
      });
    }
    if (password !== confirmPassword) {
      return CustomError.createError({
        name: "Error",
        message: "Las contraseñas no coinciden",
        code: EErrors.PASSWORD_NOT_VALID,
        info: generateUserErrorInfo(user),
      });
    }
    if (isValidPassword(user, password)) {
      return CustomError.createError({
        name: "Error",
        message: "La contraseña ingresada no puede ser igual a la anterior",
        code: EErrors.PASSWORD_NOT_VALID,
        info: generateUserErrorInfo(user),
      });
    }
    const newPassword = createHash(password);
    user.password = newPassword;
    await this.userDAO.updateUser(user._id, user);
    return user;
  }
}
