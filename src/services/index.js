import {
  User,
  Product,
  Message,
  Cart,
  Ticket,
  Session,
} from "../DAO/factory.js";

import CartServices from "./carts.services.js";
import MessageService from "./message.services.js";
import ProductService from "./products.services.js";
import TicketService from "./ticket.services.js";
import UserService from "./user.services.js";
import SessionService from "./session.services.js";
import PaymentService from "./payment.service.js";

export const productService = new ProductService(new Product(), new User());
export const messageService = new MessageService(new Message());
export const cartService = new CartServices(
  new Cart(),
  new User(),
  new Product(),
  new Ticket()
);
export const userService = new UserService(new User(), new Cart());
export const sessionService = new SessionService(new User(),new Cart());
export const ticketService = new TicketService(new Ticket());
export const paymentService = new PaymentService(new Ticket(), new Cart());