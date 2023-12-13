import CartModel from "./models/carts.mongo.models.js";

export default class CartsMongo {
  async createCart() {
    try {
      const cart = { products: [] };
      const cartCreated = await CartModel.create(cart);
      return cartCreated;
    } catch (error) {
      throw error;
    }
  }
  async getCartById(id) {
    try {
      const cart = await CartModel.findById(id)
        .populate("products.pid")
        .lean()
        .exec();
      if (cart) return cart;
      return null;
    } catch (error) {
      throw error;
    }
  }
  async updateCartById(id, data) {
    try {
      const cart = await this.getCartById(id);
      if (cart) {
        const cartUpdated = await CartModel.findByIdAndUpdate(id, data);
        return cartUpdated;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
  async deleteCartById(id) {
    try {
      const cart = await this.getCartById(id);
      if (!cart) return null;
      const cartDeleted = await cart.remove();
      return cartDeleted;
    } catch (error) {
      throw error;
    }
  }
}
