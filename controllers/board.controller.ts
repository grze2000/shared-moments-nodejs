import { Router } from "express";
import { body } from "express-validator";
import { param } from "express-validator";
import passport from "passport";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.middleware.js";
import multer from "multer";
import boardService from "../services/board.service.js";
import sharingCodeService from "../services/sharingCode.service.js";

const upload = multer({ dest: process.env.UPLOAD_DESTINATION || "uploads/" });
const boardController = Router();

/**
 * @swagger
 * /v1/boards:
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
 *                      _id:
 *                        type: string
 *                      users:
 *                        type: array
 *                        items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           fullname:
 *                             type: string
 *                           email:
 *                             type: string
 *                      name:
 *                        type: string
 *                      activities:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            _id:
 *                              type: string
 *                            name:
 *                              type: string
 *                            icon:
 *                              type: string
 *                            isCompleted:
 *                              type: boolean
 *                            completionDate:
 *                              type: string
 *                              format: date-time
 *                            photo:
 *                              type: string
 */
boardController.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  boardService.getBoards
);

/**
 * @swagger
 * /v1/boards/{boardId}:
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
boardController.get(
  "/:boardId",
  passport.authenticate("jwt", { session: false }),
  param("boardId").isMongoId(),
  handleValidationErrors,
  boardService.getBoard
);

/**
 * @swagger
 * /v1/boards:
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
 *      201:
 *        description: Created
 */
boardController.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  body("name").isString().isLength({ min: 1, max: 32 }),
  body("boardConfigurationId").isMongoId(),
  handleValidationErrors,
  boardService.createBoard
);

/**
 * @swagger
 * /v1/boards/{boardId}/get-sharing-code:
 *  get:
 *    tags: [Boards]
 *    summary: Gets a sharing code for a board
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
 *                code:
 *                  type: string
 *                expiresAt:
 *                  type: string
 *                  format: date-time
 */
boardController.get(
  "/:boardId/get-sharing-code",
  passport.authenticate("jwt", { session: false }),
  param("boardId").isMongoId(),
  sharingCodeService.getSharingCodeForBoard
);

/**
 * @swagger
 * /v1/boards/{boardId}/activity/{activityId}/complete:
 *  post:
 *    tags: [Boards]
 *    summary: Change activity status to completed
 *    parameters:
 *      - name: boardId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *      - name: activityId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *    responses:
 *      200:
 *       description: OK
 */
boardController.post(
  "/:boardId/activity/:activityId/complete",
  passport.authenticate("jwt", { session: false }),
  param("boardId").isMongoId(),
  param("activityId").isString(),
  handleValidationErrors,
  boardService.markActivityAsCompleted
);

/**
 * @swagger
 * /v1/boards/{boardId}/activity/{activityId}/photo:
 *  get:
 *    tags: [Boards]
 *    summary: Get photo for activity
 *    parameters:
 *      - name: boardId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *      - name: activityId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          image/png:
 *            schema:
 *              type: string
 *              format: binary
 */
boardController.get(
  "/:boardId/activity/:activityId/photo",
  passport.authenticate("jwt", { session: false }),
  param("boardId").isMongoId(),
  param("activityId").isString(),
  handleValidationErrors,
  boardService.getActivityPhoto
);

/**
 * @swagger
 * /v1/boards/{boardId}/activity/{activityId}/photo:
 *  post:
 *    tags: [Boards]
 *    summary: Add photo to activity
 *    parameters:
 *      - name: boardId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *      - name: activityId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              file:
 *                type: string
 *                format: binary
 *    responses:
 *      200:
 *       description: OK
 */
boardController.post(
  "/:boardId/activity/:activityId/photo",
  passport.authenticate("jwt", { session: false }),
  param("boardId").isMongoId(),
  param("activityId").isString(),
  handleValidationErrors,
  boardService.validateActivity,
  upload.single("file"),
  boardService.handleUploadedActivityPhoto
);

/**
 * @swagger
 * /v1/boards/{boardId}:
 *  delete:
 *    tags: [Boards]
 *    summary: Delete board by ID
 *    parameters:
 *      - name: boardId
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *       description: OK
 */
boardController.delete(
  "/:boardId",
  passport.authenticate("jwt", { session: false }),
  param("boardId").isMongoId(),
  handleValidationErrors,
  boardService.deleteBoard
);

export { boardController };
