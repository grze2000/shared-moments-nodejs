import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
import cors from "cors";
import mongoose from "mongoose";
import { configurePassport } from "./config/passport.js";
import swaggerUI from "swagger-ui-express";
import { swaggerDocs } from "./config/swagger.js";
import { authController } from "./controllers/auth.controller.js";
import { boardController } from "./controllers/board.controller.js";
import { boardConfigurationController } from "./controllers/boardConfiguration.controller.js";
import { sharingCodeController } from "./controllers/sharingCode.controller.js";

configurePassport();

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => {
    console.log(`[${new Date().toLocaleString()}] Connected to database`);
  })
  .catch((err) => {
    console.log(
      `[${new Date().toLocaleString()}] Database connection error: ${err}`
    );
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: true,
  })
);

const v1Router = express.Router();
v1Router.use("/auth", authController);
v1Router.use("/boards", boardController);
v1Router.use("/board-configurations", boardConfigurationController);
v1Router.use("/sharing-codes", sharingCodeController);
v1Router.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use("/v1", v1Router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[${new Date().toLocaleString()}] Listening on ${PORT}`);
});
