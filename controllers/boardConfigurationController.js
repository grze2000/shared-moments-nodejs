import { matchedData } from "express-validator";
import { BoardConfiguration } from "../models/BoardConfiguration.js";

export const getBoardConfiguration = (req, res) => {
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

export const addBoardConfiguration = (req, res) => {
  BoardConfiguration(
    matchedData(req, { locations: ["body"], includeOptionals: true })
  ).save((err, boardConfiguration) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(201).json(boardConfiguration._id);
  });
};
