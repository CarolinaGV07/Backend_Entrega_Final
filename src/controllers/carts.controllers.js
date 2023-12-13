import { cartService } from "../services/index.js";
import { Types } from "mongoose";

export const createCart = async (req, res) => {
  try {
    const cart = await cartService.createCart();
    res.status(200).json(cart);
  } catch (error) {
    req.logger.fatal("Error al crear el carrito");
    res.status(500).json({ error: error.message });
  }
};

export const getCartById = async (req, res) => {
  try {
    res.status(200).json(await cartService.getCartById(req.params.cid));
  } catch (error) {
    req.logger.fatal("Error al obtener el carrito");
    res.status(500).json({ error: error.message });
  }
};

export const updateCartById = async (req, res) => {
  try {
    const cart = await cartService.updateCartById(
      req.params.cid,
      req.params.pid,
      req.body.quantity || 1
    );
    res.status(200).json(cart);
  } catch (error) {
    req.logger.fatal("Error al actualizar el producto");
    res.status(500).json({ error: error.message });
  }
};

export const deleteCartById = async (req, res) => {
  try {
    const cid = req.params.id;
    const cartId = new Types.ObjectId(cid);
    const cart = await cartService.deleteCartById(cartId);
    res.status(200).json(cart);
  } catch (error) {
    req.logger.fatal("Error al eliminar el carrito");
    res.status(500).json({ error: error.message });
  }
};

export const addProductCartByID = async (req, res) => {
  try {
    const { user } = req.user;
    const pid = req.params.pid;
    const quantity = parseInt(req.body.quantity || 1);
    const idProduct = new Types.ObjectId(pid);
    await cartService.addProductCartByID(idProduct, quantity, user);
    res.status(200).redirect("/api/cart/user");
  } catch (error) {
    req.logger.fatal("Error al agregar el producto");
    res.status(500).json({ error: error.message });
  }
};

export const deleteProductCartByID = async (req, res) => {
  try {
    const cart = await cartService.deleteProductCartByID(
      req.params.cid,
      req.params.pid
    );
    res.status(200).json(cart);
  } catch (error) {
    req.logger.fatal("Error al eliminar el producto");
    res.status(500).json({ error: error.message });
  }
};

export const deleteProductOneCartById = async (req, res) => {
  try {
    const { user } = req.user;
    const pid = req.params.pid;
    await cartService.deleteProductOneCartById(user, pid);
    res.redirect("/api/cart/user");
  } catch (error) {
    req.logger.fatal("Error al eliminar el producto");
    res.status(500).json({ error: error.message });
  }
};

export const getCartByUserId = async (req, res) => {
  try {
    const { user } = req.user;
    const { cart, total } = await cartService.getCartUserById(user);
    const { first_name, last_name, rol, email } = user;
    if (cart) {
      res.status(200).render("./cart", {
        cart,
        first_name,
        last_name,
        email,
        rol,
        total,
        css: "cart",
      });
    } else {
      throw new Error("Cart not found");
    }
  } catch (error) {
    req.logger.fatal("Error al obtener el carrito");
    res.status(500).json({ error: error.message });
  }
};

export const updateProductCartById = async (req, res) => {
  try {
    const pid = req.params.pid;
    const cid = req.params.cid;
    await cartService.deleteProductOneCartById(cid, pid);
    res.redirect("http://localhost:8080/api/carts/user");
  } catch (e) {
    req.logger.fatal("Error al actualizar el producto");
    res.status(500).json({ error: e.message });
  }
};

export const getTicketCartUserById = async (req, res) => {
  try {
    const { user } = req.user;
    const ticket = await cartService.getTicketCartUserById(user);
    if (ticket) {
      res.status(200).render("ticket", ticket);
    } else {
      throw new Error("Error al obtener el ticket");
    }
  } catch (error) {
    req.logger.fatal("Error al obtener el ticket");
    res.status(500).json({ error: error.message });
  }
};
