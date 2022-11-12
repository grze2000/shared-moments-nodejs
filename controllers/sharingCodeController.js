import { Board } from "../models/Board.js";
import { SharingCode } from "../models/SharingCode.js";
import { User } from "../models/User.js";

const generateSharingCode = (req, res) => {
  const { boardId } = req.params;
  SharingCode({
    board: boardId,
  }).save((err, sharingCode) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(201).json(sharingCode);
  });
};

export const getSharingCodeForBoard = async (req, res) => {
  const { boardId } = req.params;
  SharingCode.findOne({ board: boardId })
    .populate(
      "board",
      { __v: false, name: false, activities: false },
      { users: req.user._id }
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

export const useSharingCodeForBoard = async (req, res) => {
  const { code: sharingCode } = req.params;
  SharingCode.findById(sharingCode)
    .then((sharingCode) => {
      if (!sharingCode) {
        return res.status(404).json({ message: "Nie znaleziono kodu" });
      }
      if (new Date(sharingCode.expiresAt) < new Date()) {
        return res.status(404).json({ message: "Kod wygasł" });
      }
      Board.findOneAndUpdate(
        { _id: sharingCode.board._id },
        { $push: { users: req.user._id } },
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
