import UserModel from "./models/users.mongo.models.js";

export default class UserMongo {
  async createUser(user) {
    try {
      if (user) return await UserModel.create(user);
    } catch (error) {
      throw error;
    }
  }
  async getUsers() {
    try {
      return await UserModel.find().lean().exec();
    } catch (error) {
      throw error;
    }
  }
  async getUserById(id) {
    try {
      if (id) return await UserModel.findById(id);
    } catch (error) {
      throw error;
    }
  }
  getUserByEmail = async (email) => {
    try {
      if (email) {
        const user = await UserModel.findOne({ email });
        if (user) return user;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };
  async updateUser(id, data) {
    try {
      if ((id, data)) return await UserModel.findByIdAndUpdate(id, data);
    } catch (e) {
      throw e;
    }
  }
  async deleteUser(id) {
    try {
      if (id) return await UserModel.findByIdAndDelete(id);
    } catch (e) {
      throw e;
    }
  }
}
