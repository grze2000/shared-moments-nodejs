import { Router } from "express";
import { checkSchema } from "express-validator";
import {
  login,
  refreshToken,
  register,
  revokeToken,
} from "../controllers/authController.js";
import { loginSchema } from "../schemas/loginSchema.js";
import { registerSchema } from "../schemas/registerSchema.js";
import { tokenSchema } from "../schemas/tokenSchema.js";

const authRouter = Router();

/**
 * @swagger
 * /auth/login:
 *  post:
 *    tags: [Auth]
 *    summary: Log in a user
 *    security: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *                format: password
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                accessToken:
 *                  type: string
 *                refreshToken:
 *                  type: string
 *                userId:
 *                  type: string
 *                email:
 *                  type: string
 *
 */
authRouter.post("/login", checkSchema(loginSchema), login);

/**
 * @swagger
 * /auth/register:
 *  post:
 *    tags: [Auth]
 *    summary: Register a new user
 *    security: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *           type: object
 *           properties:
 *             fullname:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *             confirmPassword:
 *               type: string
 *               format: password
 *    responses:
 *      201:
 *        description: Account has been created
 */
authRouter.post("/register", checkSchema(registerSchema), register);

/**
 * @swagger
 * /auth/refresh-token:
 *  post:
 *    tags: [Auth]
 *    security: []
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        schema:
 *          type: object
 *          properties:
 *            token:
 *              type: string
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                accessToken:
 *                  type: string
 *                refreshToken:
 *                  type: string
 */
authRouter.post("/refresh-token", checkSchema(tokenSchema), refreshToken);

/**
 * @swagger
 * /auth/revoke-token:
 *  post:
 *    tags: [Auth]
 *    security: []
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        schema:
 *          type: object
 *          properties:
 *            token:
 *              type: string
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Invalid token
 */
authRouter.post("/revoke-token", checkSchema(tokenSchema), revokeToken);

export { authRouter };
