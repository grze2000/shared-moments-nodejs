import mongoose from "mongoose";
import { Board } from "../models/Board.js";
import { BoardConfiguration } from "../models/BoardConfiguration.js";
import fs from "fs";

export const createBoard = (req, res) => {
  const { name, boardConfigurationId } = req.body;
  BoardConfiguration.findById(boardConfigurationId)
    .then((boardConfiguration) => {
      if (!boardConfiguration) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowa konfiguracja planszy" });
      }

      const { shape, rows, columns, title, activities } = boardConfiguration;
      if (!Array.isArray(activities) || rows * columns !== activities.length) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowa konfiguracja planszy" });
      }
      console.log(req.user);
      Board({
        users: [req.user._id],
        name,
        activities,
      }).save((err) => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }
        return res.status(201).json({ message: "Dodano nową planszę" });
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Database error" });
    });
};

export const getBoard = (req, res) => {
  const { boardId } = req.params;
  Board.findOne({ users: req.user._id, _id: boardId }, { __v: false, 'activities.photo': false })
    .populate("users", { __v: false, password: false })
    .exec()
    .then((board) => {
      if (!board) {
        return res.status(404).json({ message: "Nie znaleziono planszy" });
      }
      const completedActivities = board.activities.filter(
        (activity) => activity.isCompleted
      );
      return res.json({
        ...board.toObject(),
        progress: board.activities.length
          ? Math.round(
              (completedActivities.length / board.activities.length) * 100
            )
          : 0,
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Database error" });
    });
};

export const getBoards = (req, res) => {
  Board.find({ users: req.user._id }, { __v: false, 'activities.photo': false })
    .populate("users", { __v: false, password: false })
    .exec()
    .then((boards) => {
      return res.json({
        data: boards,
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Database error" });
    });
};

export const deleteBoard = (req, res) => {
  const { boardId } = req.params;
  Board.findOneAndDelete({ _id: boardId, users: req.user._id })
    .then((board) => {
      if (!board) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy identyfikator planszy" });
      }
      return res.sendStatus(200);
    })
    .catch((err) => {
      return res.status(500).json({ message: "Database error" });
    });
};

export const markActivityAsCompleted = (req, res) => {
  const { boardId, activityId } = req.params;
  const { name } = req.body;
  Board.findOne({ _id: boardId, users: req.user._id })
    .then((board) => {
      if (!board) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy identyfikator planszy" });
      }
      const activity = board.activities.find(
        (activity) =>
          activity._id.equals(activityId) ||
          (activity.icon === activityId && !activity.isCompleted)
      );
      if (activity) {
        activity.isCompleted = true;
        activity.completionDate = new Date().toISOString();
        if (activity.icon === "OWN_ACTIVITY" && name) {
          activity.name = name;
        }
      } else {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy identyfikator aktywności" });
      }
      board.save((err) => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }
        return res.sendStatus(200);
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Database error" });
    });
};

export const validateActivity = (req, res, next) => {
  const { boardId, activityId } = req.params;
  Board.findOne({ _id: boardId, users: req.user._id })
    .then((board) => {
      if (!board) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy identyfikator planszy" });
      }
      const activity = board.activities.find((activity) =>
        activity._id.equals(activityId)
      );
      if (activity) {
        req.board = board;
        next();
      } else {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy identyfikator aktywności" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ message: "Database error" });
    });
};

export const handleUploadedActivityPhoto = (req, res) => {
  const { activityId } = req.params;
  if (!req.board) {
    return res.status(500).json({ message: "Board not found" });
  }
  if (req.file) {
    req.board.activities.find((activity) =>
      activity._id.equals(activityId)
    ).photo = req.file.filename;
    console.log(req.file);
    req.board.save((err) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      return res.sendStatus(200);
    });
  } else {
    return res.status(400).json({ message: "Missing file" });
  }
};

export const getActivityPhoto = (req, res) => {
  const { boardId, activityId } = req.params;
  Board.findOne({ _id: boardId, users: req.user._id })
    .then((board) => {
      if (!board) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy identyfikator planszy" });
      }
      const activity = board.activities.find((activity) =>
        activity._id.equals(activityId)
      );
      if (activity) {
        if (activity.photo && fs.existsSync(`./uploads/${activity.photo}`)) {
          res.sendFile(activity.photo, { root: "uploads" });
        } else {
          res.sendStatus(404);
        }
      } else {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy identyfikator aktywności" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ message: "Database error" });
    });
};
