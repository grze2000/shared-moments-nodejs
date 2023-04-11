import { matchedData } from "express-validator";
import { BoardConfiguration } from "../models/BoardConfiguration.model.js";
import { Request, Response } from "express";

const getBoardConfiguration = (req: Request, res: Response) => {
  const { boardConfigurationId } = req.params;
  BoardConfiguration.findById(boardConfigurationId)
    .then((boardConfiguration) => {
      if (!boardConfiguration) {
        return res.sendStatus(404);
      }
      return res.json(boardConfiguration);
    })
    .catch((err) => {
      return res.status(500).json({ message: "Database error" });
    });
};

const addBoardConfiguration = (req: Request, res: Response) => {
  BoardConfiguration.create(
    matchedData(req, { locations: ["body"], includeOptionals: true })
  )
    .then((boardConfiguration) => {
      return res.status(201).json(boardConfiguration._id);
    })
    .catch((err) => {
      return res.status(500).json({ message: "Database error" });
    });
};

export default {
  getBoardConfiguration,
  addBoardConfiguration,
};
