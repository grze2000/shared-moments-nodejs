import { Router } from "express";
import { checkSchema } from "express-validator";

const boardRouter = Router();

/**
 * @swagger
 * /boards:
 *  get:
 *    tags: [Boards]
 *    summary: Gets a list of all user activity boards
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      users:
 *                        type: array
 *                        items:
 *                         type: object
 *                         properties:
 *                           fullname:
 *                             type: string
 *                           email:
 *                             type: string
 *                      name:
 *                        type: string
 *                      progress:
 *                        type: number
 */
boardRouter.get("/", () => {});

/**
 * @swagger
 * /boards/{boardId}:
 *  get:
 *    tags: [Boards]
 *    summary: Gets a board by ID
 *    parameters:
 *      - name: boardId
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
 *                users:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      fullname:
 *                        type: string
 *                      email:
 *                        type: string
 *                name:
 *                  type: string
 *                progress:
 *                  type: number
 *                activitiesProgress:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      name:
 *                        type: string
 *                      icon:
 *                        type: string
 *                      isCompleted:
 *                        type: boolean
 *                      completionDate:
 *                        type: string
 *                        format: date-time
 *                      photo:
 *                        type: string
 *                boardConfiguration:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                    shape:
 *                      type: string
 *                    rows:
 *                      type: number
 *                    columns:
 *                      type: number
 *                    title:
 *                      type: string
 *                    activities:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          name:
 *                            type: string
 *                          icon:
 *                            type: string
 */
boardRouter.get("/:id", () => {});

/**
 * @swagger
 * /boards:
 *  post:
 *    tags: [Boards]
 *    summary: Creates a new board based on passed board configuration
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             boardConfigurationId:
 *               type: string
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                users:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      fullname:
 *                        type: string
 *                      email:
 *                        type: string
 *                name:
 *                  type: string
 *                progress:
 *                  type: number
 *                activitiesProgress:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      name:
 *                        type: string
 *                      icon:
 *                        type: string
 *                      isCompleted:
 *                        type: boolean
 *                      completionDate:
 *                        type: string
 *                        format: date-time
 *                      photo:
 *                        type: string
 *                boardConfiguration:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                    shape:
 *                      type: string
 *                    rows:
 *                      type: number
 *                    columns:
 *                      type: number
 *                    title:
 *                      type: string
 *                    activities:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          name:
 *                            type: string
 *                          icon:
 *                            type: string
 */
boardRouter.post("/", () => {});

export { boardRouter };
