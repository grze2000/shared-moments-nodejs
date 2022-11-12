import { Router } from "express";
import { param } from "express-validator";
import passport from "passport";
import { useSharingCodeForBoard } from "../controllers/sharingCodeController.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";

const sharingCodeRouter = Router();

/**
 * @swagger
 * /v1/sharing-codes/{code}:
 *  post:
 *    tags: [Sharing codes]
 *    summary: Share a board to a user by sharing code
 *    parameters:
 *      - name: code
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: OK
 */
sharingCodeRouter.post(
  "/:code",
  passport.authenticate("jwt", { session: false }),
  param("code").isMongoId(),
  handleValidationErrors,
  useSharingCodeForBoard
);

export { sharingCodeRouter };
