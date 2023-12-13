import {
  getMessages,
  saveMessage,
} from "../controllers/messages.controllers.js";
import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/", passport.authenticate("jwt", { session: false }), getMessages);

router.post("/", passport.authenticate("jwt", { session: false }), saveMessage);

export default router;
