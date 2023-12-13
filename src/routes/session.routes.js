import { Router } from "express";
import {
  loginUser,
  registerUser,
  getUserCurrent,
  getProfile,
  resetearPassword,
  restart,
  resetPasswordForm,
  validPassword
} from "../controllers/session.controllers.js";
import passport from "passport";
import { generateToken } from "../utils.js";
const router = Router();

router.post("/login", loginUser);

router.post("/register", registerUser);

router.get("/login", (req, res) => {
  if (Object.keys(req.cookies).length != 0) return res.redirect("/profile");
  res.render("login", {});
});

router.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.clearCookie("keyCookieForJWT").redirect("/api/session/login");
  }
);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  getProfile
);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  getUserCurrent
);

router.get(
  "/login-github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/" }),
  async (req, res) => {
    const access_token = generateToken(req.user);
    res
      .cookie("keyCookieForJWT", (req.user.token = access_token), {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
      })
      .redirect("/profile");
  }
);
router.get(
  "/login-google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
  async (req, res) => {}
);
router.get(
  "/googlecallback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    const access_token = generateToken(req.user);
    res
      .cookie("keyCookieForJWT", access_token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .redirect("/profile");
  }
);

router.get("/resetPassword", resetearPassword);
router.post("/restart", restart);
router.get("/resetPasswordForm/:token", resetPasswordForm);
router.post("/validPassword", validPassword);

export default router;
