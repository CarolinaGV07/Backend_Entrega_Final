/*-----Import the dependencies-----*/
import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";
import initializatePassport from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import { addLogger } from "./loggers/logger.js";
import swaggerUiExpress from "swagger-ui-express";
import { specs } from "./swagger/swagger.js";

/*-----Import the routes-----*/
import productsRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import viewsRoutes from "./routes/views.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import { messageService } from "./services/index.js";
import { productService } from "./services/index.js";
import userRoutes from "./routes/user.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

/*-----Configure the server-----*/
const PORT = config.port;
const app = express();

/*-----configure the template engine-----*/
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(__dirname + "/public"));

app.use(addLogger);

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.URI,
      dbName: config.dbName,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: config.ttl,
    }),
    secret: "CoderSecret",
    resave: true,
    saveUninitialized: true,
  })
);

initializatePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser("keyCookieForJWT"));

app.use("/", viewsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment",paymentRoutes);
app.use(
  "/api/docs",
  passport.authenticate("jwt", { session: false }),
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(specs)
);

const runServer = () => {
  const httpServer = app.listen(
    PORT,
    console.log(`✅Server escuchando in the port: ${PORT}`)
  );
  const io = new Server(httpServer);
  io.on("connection", (socket) => {
    console.log("Client connected succesly");
    socket.on("new-product", async (data) => {
      try {
        await productService.addProduct(data);
        const products = await productService.getProducts();
        io.emit("reload-table", products);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on("delete-product", async (id, email) => {
      try {
        await productService.deleteProduct(id, email);
        const products = await productService.getProducts();
        io.emit("reload-table", products);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on("message", async (data) => {
      await messageService.saveMessage(data);
      //Envia el back
      const messages = await messageService.getMessages();
      io.emit("messages", messages);
    });
    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
};

runServer();

export default app;