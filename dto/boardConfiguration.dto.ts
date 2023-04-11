import { CustomValidator, Schema } from "express-validator";
import { BOARD_FIELD_SHAPES } from "../enums/boardFieldShapes.enum";
import { BOARD_FORMATS } from "../enums/boardFormats.enum";

const correctActivityListValidator: CustomValidator = (value, { req }) => {
  if (!Array.isArray(value)) {
    throw new Error("Nieprawidłowa lista aktywności");
  }
  if (value.length !== req.body.rows * req.body.columns) {
    throw new Error("Ilość aktywności nie zgadza się z ilością pól na planszy");
  }
  return true;
};

export const boardConfigurationDto: Schema = {
  shape: {
    in: ["body"],
    isEmpty: {
      negated: true,
      errorMessage: "Podaj kształt planszy",
    },
    isIn: {
      options: [Object.values(BOARD_FIELD_SHAPES)],
      errorMessage: "Nieprawidłowy kaształt planszy",
    },
  },
  rows: {
    in: ["body"],
    isEmpty: {
      negated: true,
      errorMessage: "Podaj liczbe wierszy",
    },
    isNumeric: {
      errorMessage: "Nieprawidłowa liczba wierszy",
    },
  },
  columns: {
    in: ["body"],
    isEmpty: {
      negated: true,
      errorMessage: "Podaj liczbe kolumn",
    },
    isNumeric: {
      errorMessage: "Nieprawidłowa liczba kolumn",
    },
  },
  "tileSize.width": {
    in: ["body"],
    isEmpty: {
      negated: true,
      errorMessage: "Nie podano wymiarów kafelków",
    },
    isNumeric: {
      errorMessage: "Nieprawidłowa szerokość kafelka",
    },
  },
  "tileSize.height": {
    isEmpty: {
      negated: true,
      errorMessage: "Nie podano wymiarów kafelków",
    },
    isNumeric: {
      errorMessage: "Nieprawidłowa wysokość kafelka",
    },
  },
  format: {
    in: ["body"],
    isEmpty: {
      negated: true,
      errorMessage: "Podaj format planszy",
    },
    isIn: {
      options: [Object.values(BOARD_FORMATS)],
      errorMessage: "Nieprawidłowy format planszy",
    },
  },
  title: {
    in: ["body"],
    isEmpty: {
      negated: true,
      errorMessage: "Podaj tytuł planszy",
    },
    isLength: {
      options: { min: 0, max: 32 },
      errorMessage: "Hasło nie może być dłuższe niż 32 znaki",
    },
  },
  activities: {
    custom: {
      options: correctActivityListValidator,
    },
  },
  "activities.*.name": {
    in: ["body"],
    isEmpty: {
      negated: true,
      errorMessage: "Brakująca nazwa aktywności",
    },
    isLength: {
      options: { min: 0, max: 50 },
      errorMessage: "Nazwa aktywności nie może być dłuższa niż 50 znaków",
    },
  },
  "activities.*.icon": {
    in: ["body"],
    isEmpty: {
      negated: true,
      errorMessage: "Brakująca ikona aktywności",
    },
  },
};
