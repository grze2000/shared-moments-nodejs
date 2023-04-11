import { Board } from "../models/Board.model.js";
import { BoardConfiguration } from "../models/BoardConfiguration.model.js";
import fs from "fs";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/User.model.js";

const createBoard = (req: Request, res: Response) => {
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
      const user = req.user as IUser;
      Board.create({
        users: [user._id],
        name,
        activities,
      })
        .then(() => {
          return res.status(201).json({ message: "Dodano nową planszę" });
        })
        .catch((err) => {
          return res.status(500).json({ message: "Database error" });
        });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Database error" });
    });
};

const getBoard = (req: Request, res: Response) => {
  const { boardId } = req.params;
  const user = req.user as IUser;
  Board.findOne(
    { users: user._id, _id: boardId },
    { __v: false, "activities.photo": false }
  )
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

const getBoards = (req: Request, res: Response) => {
  const user = req.user as IUser;
  Board.find({ users: user._id }, { __v: false, "activities.photo": false })
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

const deleteBoard = (req: Request, res: Response) => {
  const { boardId } = req.params;
  const user = req.user as IUser;
  Board.findOneAndDelete({ _id: boardId, users: user._id })
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

const markActivityAsCompleted = (req: Request, res: Response) => {
  const { boardId, activityId } = req.params;
  const { name } = req.body;
  const user = req.user as IUser;
  Board.findOne({ _id: boardId, users: user._id })
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
        activity.completionDate = new Date();
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

const validateActivity = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { boardId, activityId } = req.params;
  const user = req.user as IUser;
  Board.findOne({ _id: boardId, users: user._id })
    .then((board) => {
      if (!board) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy identyfikator planszy" });
      }
      const activity = board.activities.find((activity) =>
        activity._id.equals(activityId)
      );
      if (!activity) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy identyfikator aktywności" });
      }
      next();
    })
    .catch((err) => {
      return res.status(500).json({ message: "Database error" });
    });
};

const handleUploadedActivityPhoto = (req: Request, res: Response) => {
  const { boardId, activityId } = req.params;
  const user = req.user as IUser;
  Board.findOne({ _id: boardId, users: user._id }).then((board) => {
    if (!board) {
      return res.status(500).json({ message: "Board not found" });
    }
    if (req.file) {
      const activity = board.activities.find((activity) =>
        activity._id.equals(activityId)
      );
      if (!activity) {
        return res
          .status(400)
          .json({ message: "Nieprawidłowy identyfikator aktywności" });
      }
      if (activity.photo && fs.existsSync(`./uploads/${activity.photo}`)) {
        fs.unlinkSync(`./uploads/${activity.photo}`);
      }
      activity.photo = req.file.filename;
      board.save((err) => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }
        return res.sendStatus(200);
      });
    } else {
      return res.status(400).json({ message: "Missing file" });
    }
  });
};

const getActivityPhoto = (req: Request, res: Response) => {
  const { boardId, activityId } = req.params;
  const user = req.user as IUser;
  Board.findOne({ _id: boardId, users: user._id })
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

export default {
  createBoard,
  getBoard,
  getBoards,
  deleteBoard,
  markActivityAsCompleted,
  validateActivity,
  handleUploadedActivityPhoto,
  getActivityPhoto,
};