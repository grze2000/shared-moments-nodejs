import { Router } from "express";
import { param } from "express-validator";
import { checkSchema } from "express-validator";
import passport from "passport";
import {
  addBoardConfiguration,
  getBoardConfiguration,
} from "../controllers/boardConfigurationController.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";
import { boardConfigurationSchema } from "../schemas/boardConfigurationSchema.js";

const boardConfigurationRouter = Router();

/**
 * @swagger
 * /v1/board-configurations/{boardConfigurationId}:
 *  get:
 *    tags: [Board Configurations]
 *    summary: Gets a board configuration by ID
 *    parameters:
 *      - name: boardConfigurationId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                shape:
 *                  type: string
 *                rows:
 *                  type: number
 *                columns:
 *                  type: number
 *                tileSize:
 *                  type: object
 *                  properties:
 *                    width:
 *                      type: number
 *                    height:
 *                      type: number
 *                format:
 *                  type: string
 *                title:
 *                  type: string
 *                activities:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      name:
 *                        type: string
 *                      icon:
 *                        type: string
 */
boardConfigurationRouter.get(
  "/:boardConfigurationId",
  passport.authenticate("jwt", { session: false }),
  param("boardConfigurationId").isMongoId(),
  handleValidationErrors,
  getBoardConfiguration
);

/**
 * @swagger
 * /v1/board-configurations:
 *  post:
 *    tags: [Board Configurations]
 *    summary: Add a new board configuration
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              shape:
 *                type: string
 *              rows:
 *                type: number
 *              columns:
 *                type: number
 *              tileSize:
 *                type: object
 *                properties:
 *                  width:
 *                    type: number
 *                  height:
 *                    type: number
 *              format:
 *                type: string
 *              title:
 *                type: string
 *              activities:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                    icon:
 *                      type: string
 *    responses:
 *      201:
 *        description: Created
 */
boardConfigurationRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkSchema(boardConfigurationSchema),
  handleValidationErrors,
  addBoardConfiguration
);

export { boardConfigurationRouter };
