import { Router } from "express";
import { body } from "express-validator";
import { param } from "express-validator";
import passport from "passport";
import {
  createBoard,
  deleteBoard,
  getActivityPhoto,
  getBoard,
  getBoards,
  handleUploadedActivityPhoto,
  markActivityAsCompleted,
  validateActivity,
} from "../controllers/boardController.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";
import multer from "multer";
import {
  getSharingCodeForBoard,
  useSharingCodeForBoard,
} from "../controllers/sharingCodeController.js";

const upload = multer({ dest: process.env.UPLOAD_DESTINATION || "uploads/" });
const boardRouter = Router();

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
boardRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getBoards
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
boardRouter.get(
  "/:boardId",
  passport.authenticate("jwt", { session: false }),
  param("boardId").isMongoId(),
  handleValidationErrors,
  getBoard
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
boardRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  body("name").isString().isLength({ min: 1, max: 32 }),
  body("boardConfigurationId").isMongoId(),
  handleValidationErrors,
  createBoard
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
boardRouter.get(
  "/:boardId/get-sharing-code",
  passport.authenticate("jwt", { session: false }),
  param("boardId").isMongoId(),
  getSharingCodeForBoard
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
boardRouter.post(
  "/:boardId/activity/:activityId/complete",
  passport.authenticate("jwt", { session: false }),
  param("boardId").isMongoId(),
  param("activityId").isString(),
  handleValidationErrors,
  markActivityAsCompleted
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
boardRouter.get(
  "/:boardId/activity/:activityId/photo",
  passport.authenticate("jwt", { session: false }),
  param("boardId").isMongoId(),
  param("activityId").isString(),
  handleValidationErrors,
  getActivityPhoto
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
boardRouter.post(
  "/:boardId/activity/:activityId/photo",
  passport.authenticate("jwt", { session: false }),
  param("boardId").isMongoId(),
  param("activityId").isString(),
  handleValidationErrors,
  validateActivity,
  upload.single("file"),
  handleUploadedActivityPhoto
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
boardRouter.delete(
  "/:boardId",
  passport.authenticate("jwt", { session: false }),
  param("boardId").isMongoId(),
  handleValidationErrors,
  deleteBoard
);

export { boardRouter };
