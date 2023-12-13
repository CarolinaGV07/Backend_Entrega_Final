import { Router } from "express";
import passport from "passport";
import {
  userPremium,
  uploadDocuments,
  uploadDocumentView,
  getUsers,
  inactiveUser,
  deleteUser
} from "../controllers/users.controllers.js";
import upload from "../middlewares/multer.js";

const router = Router();

router.get(
  "/premium/:uid",
  passport.authenticate("jwt", { session: false }),
  userPremium
);

router.post(
  "/:uid/documents",
  passport.authenticate("jwt", { session: false }),
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "productImage", maxCount: 1 },
    { name: "documentDNI", maxCount: 1 },
    { name: "comprobanteDomicilio", maxCount: 1 },
    { name: "comprobanteEstadoCuenta", maxCount: 1 },
  ]),
  uploadDocuments
);

router.get(
  "/uploadDocuments",
  passport.authenticate("jwt", { session: false }),
  uploadDocumentView
);

router.get("/", passport.authenticate("jwt", { session: false }), getUsers);

router.get(
  "/delete/:uid",
  passport.authenticate("jwt", { session: false }),
  deleteUser
);

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  inactiveUser
);

export default router;
