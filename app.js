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

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use('/auth', authRouter);
app.use('/boards', boardRouter);
app.use('/board-configurations', boardConfigurationRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[${new Date().toLocaleString()}] Listening on ${PORT}`);
});
