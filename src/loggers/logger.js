import winston from "winston";
import { environment } from "../enums/ambient.enums.js";

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "white",
  },
};

let logger;

logger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: environment.development ? "debug" : "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: environment.development
        ? "./error_dev.log"
        : "./error_prod.log",
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

export const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(
    `${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};
