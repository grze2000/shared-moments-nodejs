import { Router } from "express";
import { checkSchema } from "express-validator";

const boardConfigurationRouter = Router();

/**
 * @swagger
 * /board-configurations/{boardConfigurationId}:
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
boardConfigurationRouter.get("/", () => {});

export { boardConfigurationRouter };
