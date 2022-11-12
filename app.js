import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import { configurePassport } from "./config/passport.js";
configurePassport(passport);
import swaggerUI from "swagger-ui-express";
import { swaggerDocs } from "./config/swagger.js";
import { authRouter } from "./routes/authRoutes.js";
import { boardRouter } from "./routes/boardRoutes.js";
import { boardConfigurationRouter } from "./routes/boardConfigurationRoutes.js";
import { sharingCodeRouter } from "./routes/sharingCodeRoutes.js";

const mongooseOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose
  .connect(process.env.MONGODB_URI, mongooseOptions)
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
v1Router.use('/auth', authRouter);
v1Router.use('/boards', boardRouter);
v1Router.use('/board-configurations', boardConfigurationRouter);
v1Router.use('/sharing-codes', sharingCodeRouter)
v1Router.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use('/v1', v1Router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[${new Date().toLocaleString()}] Listening on ${PORT}`);
});
