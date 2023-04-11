import { Router } from "express";
import { param } from "express-validator";
import passport from "passport";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.middleware.js";
import sharingCodeService from "../services/sharingCode.service.js";

const sharingCodeController = Router();

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
sharingCodeController.post(
  "/:code",
  passport.authenticate("jwt", { session: false }),
  param("code").isMongoId(),
  handleValidationErrors,
  sharingCodeService.useSharingCodeForBoard
);

export { sharingCodeController };
