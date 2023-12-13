import {
  createCart,
  getCartById,
  addProductCartByID,
  deleteProductOneCartById,
  getCartByUserId,
  updateProductCartById,
  getTicketCartUserById,
} from "../controllers/carts.controllers.js";

import { Router } from "express";
import passport from "passport";

const router = Router();

router.post("/", passport.authenticate("jwt", { session: false }), createCart);
router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  getCartByUserId
);
router.get(
  "/pid/:pid",
  passport.authenticate("jwt", { session: false }),
  addProductCartByID
);
router.get(
  "/delete/:pid",
  passport.authenticate("jwt", { session: false }),
  deleteProductOneCartById
);
router.put(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  updateProductCartById
);
router.get(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  getCartById
);

router.get(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  getTicketCartUserById
);

export default router;
