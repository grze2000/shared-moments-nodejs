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
  // Get the board configuration from the request body
  const { shape, rows, columns, title, activities } = req.body;
  console.log(shape, rows, columns, title, activities);
  BoardConfiguration({
    shape,
    rows,
    columns,
    title,
    activities,
  }).save((err) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(201).json({ message: "Dodano nową konfigurację planszy" });
  });
};
