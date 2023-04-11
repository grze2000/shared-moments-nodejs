import { Request, Response } from "express";
import { Board } from "../models/Board.model.js";
import { SharingCode } from "../models/SharingCode.model.js";
import { IUser, User } from "../models/User.model.js";

const generateSharingCode = (req: Request, res: Response) => {
  const { boardId } = req.params;
  SharingCode.create({
    board: boardId,
  }).then((sharingCode) => {
    return res.status(201).json(sharingCode);
  }).catch((err) => {
    return res.status(500).json({ message: "Database error" });
  });
};

const getSharingCodeForBoard = async (req: Request, res: Response) => {
  const { boardId } = req.params;
  SharingCode.findOne({ board: boardId })
    .populate(
      "board",
      { __v: false, name: false, activities: false },
      // { users: req.user._id }
    )
    .then((sharingCode) => {
      if (!sharingCode) {
        return generateSharingCode(req, res);
      }
      if (new Date(sharingCode.expiresAt) < new Date()) {
        SharingCode.findOneAndDelete(sharingCode._id)
          .then(() => {
            return generateSharingCode(req, res);
          })
          .catch((err) => {
            return res.status(500).json({ message: "Database error" });
          });
      } else {
        return res.json(sharingCode);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    });
};

const useSharingCodeForBoard = async (req: Request, res: Response) => {
  const { code: sharingCode } = req.params;
  SharingCode.findById(sharingCode)
    .then((sharingCode) => {
      if (!sharingCode) {
        return res.status(404).json({ message: "Nie znaleziono kodu" });
      }
      if (new Date(sharingCode.expiresAt) < new Date()) {
        return res.status(404).json({ message: "Kod wygasł" });
      }
      const user = req.user as IUser;
      Board.findOneAndUpdate(
        { _id: sharingCode.board._id },
        { $push: { users: user._id } },
        { new: true }
      )
        .then((board) => {
          return res.json(board);
        })
        .catch((err) => {
          return res.status(500).json({ message: "Database error" });
        });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Database error" });
    });
};

export default {
  getSharingCodeForBoard,
  useSharingCodeForBoard,
};
