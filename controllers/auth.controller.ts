import { Router } from "express";
import { checkSchema } from "express-validator";
import authService from "../services/auth.service.js";
import { loginDto } from "../dto/login.dto.js";
import { registerDto } from "../dto/register.dto.js";
import { tokenDto } from "../dto/token.dto.js";

const authController = Router();

/**
 * @swagger
 * /v1/auth/login:
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
authController.post("/login", checkSchema(loginDto), authService.login);

/**
 * @swagger
 * /v1/auth/register:
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
authController.post("/register", checkSchema(registerDto), authService.register);

/**
 * @swagger
 * /v1/auth/refresh-token:
 *  post:
 *    tags: [Auth]
 *    security: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
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
authController.post("/refresh-token", checkSchema(tokenDto), authService.refreshToken);

/**
 * @swagger
 * /v1/auth/revoke-token:
 *  post:
 *    tags: [Auth]
 *    security: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Invalid token
 */
authController.post("/revoke-token", checkSchema(tokenDto), authService.revokeToken);

export { authController };
