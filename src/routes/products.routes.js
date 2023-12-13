import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsRealTime,
} from "../controllers/products.controllers.js";

import { Router } from "express";
import passport from "passport";
const router = Router();

router.get("/", passport.authenticate("jwt", { session: false }), getProducts);
router.get(
  "/realtimeProducts",
  passport.authenticate("jwt", { session: false }),
  getProductsRealTime
);
router.get(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  getProductById
);
router.post("/", passport.authenticate("jwt", { session: false }), addProduct);
router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  updateProduct
);
router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  deleteProduct
);



export default router;
