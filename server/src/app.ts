import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import routes from "./routes/index";
import { errorHandler } from "./middlewares/error";

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(morgan("dev"));

  app.use("/api", routes);

  app.use((_req, res) => res.status(404).json({ message: "Not Found" }));
  app.use(errorHandler);
  return app;
}
