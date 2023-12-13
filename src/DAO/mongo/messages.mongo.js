import MessageModel from "./models/messages.mongo.models.js";

export default class MessagesMongo {
  async saveMessages(data) {
    try {
      if (data) return await MessageModel.create(data);
    } catch (error) {
      throw new Error(error);
    }
  }
  async getMessages() {
    try {
      return await MessageModel.find().lean().exec();
    } catch (error) {
      throw new Error(error);
    }
  }
}
