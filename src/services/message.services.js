import MessageDto from "../DTO/messages.dto.js";
import CustomError from "../errors/CustomError.js";
import EErrors from "../errors/enums.js";
import { generateMessagesInfo } from "../errors/info.js";

export default class MessageService {
  constructor(messageDAO) {
    this.messageDAO = messageDAO;
  }
  async saveMessage(data) {
    try {
      const message = await this.messageDAO.saveMessages(data);
      return new MessageDto(message);
    } catch (error) {
      CustomError.createError({
        name: "Error al guardar el mensaje",
        message: "Cart not products",
        code: EErrors.MESSAGES_NOT_SAVE,
        info: generateMessagesInfo(""),
      });
    }
  }
  async getMessages() {
    try {
      const messages = await this.messageDAO.getMessages();
      return messages;
    } catch (error) {
      CustomError.createError({
        name: "Error al obtener los mensajes",
        message: "Messages not found",
        code: EErrors.MESSAGES_NOT_FOUND,
        info: generateMessagesInfo(""),
      });
    }
  }
}
