import UserDTO from "../DTO/user.dto.js";
import CustomError from "../errors/CustomError.js";
import EErrors from "../errors/enums.js";
import {
  generateUserErrorInfo,
  generateCartErrorInfo,
} from "../errors/info.js";

export default class UserService {
  constructor(userDAO, cartDAO) {
    this.userDAO = userDAO;
    this.cartDAO = cartDAO;
  }
  async createUser(data) {
    try {
      const user = await this.userDAO.createUser(data);
      return user;
    } catch (error) {
      CustomError.createError({
        name: "Error al crear el usuario",
        message: "Error al crear el usuario",
        code: EErrors.USER_NOT_CREATE,
        info: generateUserErrorInfo(error),
      });
    }
  }
  async getUserById(id) {
    try {
      const user = await this.userDAO.getUserById(id);
      return user;
    } catch (error) {
      CustomError.createError({
        name: "Error al obtener el usuario",
        message: "Error al obtener el usuario",
        code: EErrors.USER_NOT_FOUND,
        info: generateUserErrorInfo(error),
      });
    }
  }
  async getUsers() {
    try {
      const users = await this.userDAO.getUsers();
      return users.map((user) => new UserDTO(user));
    } catch (error) {
      CustomError.createError({
        name: "Error al obtener el usuario",
        message: "Error al obtener el usuario",
        code: EErrors.USER_NOT_FOUND,
        info: generateUserErrorInfo(error),
      });
    }
  }
  async getUserByEmail(email) {
    try {
      const user = await this.userDAO.getUserByEmail(email);
      return user;
    } catch (error) {
      CustomError.createError({
        name: "Error al obtener el usuario",
        message: "Error al obtener el usuario",
        code: EErrors.USER_NOT_FOUND,
        info: generateUserErrorInfo(error),
      });
    }
  }

  async getUserByEmailCode(email, verificationCode) {
    try {
      const user = await this.userDAO.getUserByEmailCode(
        email,
        verificationCode
      );
      return new UserDTO(user);
    } catch (e) {
      throw e;
    }
  }

  async updateUser(id, data) {
    try {
      const user = await this.userDAO.updateUser(id, data);
      return new UserDTO(user);
    } catch (error) {
      CustomError.createError({
        name: "Error al actualizar el usuario",
        message: "Error al actualizar el usuario",
        code: EErrors.USER_NOT_UPDATE,
        info: generateUserErrorInfo(error),
      });
    }
  }

  async deleteUser(id) {
    try {
      const user = await this.userDAO.deleteUser(id);
      return new UserDTO(user);
    } catch (error) {
      CustomError.createError({
        name: "Error al eliminar el usuario",
        message: "Error al eliminar el usuario",
        code: EErrors.USER_NOT_DELETE,
        info: generateUserErrorInfo(error),
      });
    }
  }

  addCartToUser = async (userId, cartId) => {
    try {
      const user = await this.userDAO.getUserById(userId);
      user.cart.push(cartId);
      user.save();
      return user;
    } catch (e) {
      CustomError.createError({
        name: "Error al agregar el carrito al usuario",
        message: "Error al agregar el carrito al usuario",
        code: EErrors.USER_NOT_CART,
        info: generateUserErrorInfo(e),
      });
    }
  };

  async userPremium(id) {
    try {
      const user = await this.userDAO.getUserById(id);
      if (user) {
        if (user.rol === "admin") {
          CustomError.createError({
            message: "No authorized",
            code: EErrors.USER_NOT_AUTHORIZED,
            status: 401,
            info: generateCartErrorInfo({ pid }),
          });
        }
        if (user.rol === "user" && user.documents.length >= 4) {
          user.rol = "premium";
          await this.userDAO.updateUser(user._id, user);
          return user;
        } else if (user.rol === "premium") {
          user.rol = "user";
          await this.userDAO.updateUser(user._id, user);
          return user;
        } else {
          throw CustomError.createError({
            message: "You have not uploaded the complete documentation",
            code: EErrors.USER_NOT_AUTHORIZED,
            status: 401,
            info: generateUserErrorInfo({
              message: "You have not uploaded the complete documentation",
            }),
          });
        }
      } else {
        CustomError.createError({
          message: "User not found",
          code: EErrors.USER_NOT_EXISTS,
          status: 404,
          info: generateCartErrorInfo({ pid }),
        });
      }
    } catch (error) {
      throw CustomError.createError({
        message: "You have not uploaded the complete documentation",
        code: EErrors.USER_NOT_AUTHORIZED,
        status: 401,
        info: generateUserErrorInfo({
          message: "You have not uploaded the complete documentation",
        }),
      });
    }
  }

  inactiveUsersDrop = async () => {
    try {
      const inactiveUser = await this.userDAO.inactiveUser();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.USER,
          pass: config.PASS,
        },
      });

      if (inactiveUser.length > 0) {
        inactiveUser.forEach(async (user) => {
          const mailOptions = {
            to: user.email,
            subject: "Cuenta eliminada por inactividad",
            text: "Tu cuenta ha sido eliminada debido a inactividad. Puedes registrarte nuevamente si lo deseas.",
          };
          await transporter.sendMail(mailOptions);
          return { message: "success" };
        });
      } else {
        throw CustomError.createError({
          message: "there are no users to delete",
          code: EErrors.USER_NOT_AUTHORIZED,
          status: 401,
          info: generateUserErrorInfo({
            message: "there are no users to delete",
          }),
        });
      }
    } catch (e) {
      throw e;
    }
  };
}
