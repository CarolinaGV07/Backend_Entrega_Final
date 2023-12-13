import passport from "passport";
import GitHubStrategy from "passport-github";
import { generateToken } from "../utils.js";
import jwt from "passport-jwt";
import { userService, cartService } from "../services/index.js";
import config from "./config.js";

/*

App ID: 405493

Client ID: Iv1.f9814bc313e1f045

Secret: 0071e261345dc0af4c51cd62c46bef7f76dc8262

*/

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) =>
  req && req.cookies ? req.cookies["keyCookieForJWT"] : null;

const initializePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "secretForJWT",
      },
      async (jwtPayload, done) => {
        try {
          done(null, jwtPayload);
        } catch (error) {
          return done("Error to login with JWT" + error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: config.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userService.getUserByEmail(profile._json.email);
          if (user) {
            const token = generateToken(user);
            user.token = token;
            const date = new Date();
            user.last_connection = date;
            await userService.updateUser(user._id, user);
            return done(null, user);
          }
          const cart = await cartService.createCart();
          const date = new Date();
          const newUser = {
            first_name: profile._json.name,
            last_name: "",
            email: profile._json.email,
            age: "",
            password: "",
            cartId: [],
            rol: "user",
            status: "verified",
            verificationCode: "true",
            documents: [],
            last_connection: date,
            ticketId: [],
          };
          const access_token = generateToken(newUser);
          newUser.token = access_token;
          const userNew = await userService.createUser(newUser);
          userNew.cartId.push(cart._id);
          const result = await userService.updateUser(userNew._id, userNew);
          return done(null, result);
        } catch (error) {
          return done("Error to login with Github" + error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userService.findById(id);
    done(null, user);
  });
};

export default initializePassport;
