import { config } from "dotenv";
config();

export default {
  persistence: process.env.persistence || "MONGO",
  port: process.env.PORT || 8080,
  dbName: process.env.dbName || "ecommerce",
  ttl: process.env.ttl || 3600,
  URI: process.env.URI,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL: process.env.GITUHB_CALLBACK_URL,
  USER: process.env.USER,
  PASS: process.env.PASS,
  keyPrivate: process.env.keyPrivate,
  sucess: process.env.sucess,
  cancell: process.env.cancell,
  session: process.env.session,
};
