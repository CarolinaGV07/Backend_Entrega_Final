import { Router } from "express";
import passport from "passport";
import {
  creacteCheckout,
  sucessPayment,
  CancellPayment,
} from "../controllers/payment.controllers.js";

const router = Router();

router.post("/create-checkout-session",passport.authenticate("jwt", { session: false }), creacteCheckout);
router.get("/sucess",sucessPayment);
router.get("/cancel",CancellPayment);

export default router;
