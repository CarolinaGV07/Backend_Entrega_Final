import config from "../config/config.js";
import mongoose from "mongoose";

export let User;
export let Product;
export let Message;
export let Cart;
export let Ticket;
export let Session;

console.log(`Persistence with ${config.persistence}`);
switch (config.persistence) {
  case "MONGO":
    mongoose
      .connect(process.env.URI, {
        dbName: config.dbName,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("Database Connected Successfully"))
      .catch((err) => console.log(err));
    const { default: UserMongo } = await import("./mongo/users.mongo.js");
    const { default: ProductMongo } = await import("./mongo/products.mongo.js");
    const { default: MessageMongo } = await import("./mongo/messages.mongo.js");
    const { default: CartMongo } = await import("./mongo/carts.mongo.js");
    const { default: TicketMongo } = await import("./mongo/tickets.mongo.js");
    const { default: SessionMongo } = await import("./mongo/users.mongo.js");
    User = UserMongo;
    Product = ProductMongo;
    Message = MessageMongo;
    Cart = CartMongo;
    Ticket = TicketMongo;
    Session = SessionMongo;
}
