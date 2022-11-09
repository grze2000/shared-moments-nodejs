import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';
import { User } from "../models/User.js";
import { RefreshToken } from "../models/RefreshToken.js";

export const login = (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  User.findOne({email: req.body.email}, (err, user) => {
    if(err) {
      return res.status(500).json({message: 'Database error'});
    }
    if(!user) {
      return res.status(400).json({message: 'Nieprawidłowy email lub hasło'});
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!err && isMatch) {
        const expirationDate = new Date(Date.now() + 1000*60*60*24*30);
        const accessToken = jwt.sign({
          id: user._id,
        }, process.env.SECRET, {
          expiresIn: 60*15,
        });

        const refreshToken = jwt.sign({
          id: user._id,
        }, process.env.REFRESH_TOKEN_SECRET, {
          expiresIn: 60*60*24*30,
        });

        const newRefreshToken = new RefreshToken({
          token: refreshToken,
          expireAt: expirationDate,
        });

        newRefreshToken.save(err => {
          if(err) {
            res.status(500).json({message: 'Database error'});
          } else {
            res.json({
              accessToken,
              refreshToken,
              userId: user._id,
              email: user.email,
            });
          }
        });
      } else {
        res.status(400).json({message: 'Nieprawidłowy email lub hasło'});
      }
    });
  });
}

export const register = (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  const {fullname, email, password} = req.body;

  User.findOne({
    email
  }, (err, user) => {
    if(err) {
      return res.status(500).json({message: 'Database error'});
    }
    if(user) {
      return res.status(400).json({message: 'Użytkownik z takim mailem już istnieje'});
    }
    User({
      fullname,
      email,
      password,
    }).save(err => {
      if(err) {
        return res.status(500).json({message: 'Database error'});
      }
      return res.status(201).json({message: 'Konto zostało utworzone!'});
    })
  });
}

export const refreshToken = (req, res) => {
  RefreshToken.findOne({token: req.body.token}, (err, token) => {
    if(err) {
      return res.status(500).json({message: 'Database error'});
    }
    if(!token) {
      return res.status(400).json({message: 'Nieprawidłowy token'});
    }
    jwt.verify(req.body.token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if(err || !user) {
        return res.status(400).json({message: 'Nieprawidłowy token'});
      }

      const expirationDate = new Date(Date.now() + 1000*60*60*24*30);
      const accessToken = jwt.sign({
        id: user.id,
      }, process.env.SECRET, {
        expiresIn: 60*15,
      });
      const refreshToken = jwt.sign({
        id: user.id,
      }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: 60*60*24*30,
      });

      token.token = refreshToken;
      token.expireAt = expirationDate;
      token.save(err => {
        if(err) {
          return res.status(500).json({message: 'Database error'});
        }
        res.json({
          accessToken,
          refreshToken,
        });
      });
    });
  });
}

export const revokeToken = (req, res) => {
  RefreshToken.findOneAndDelete({token: req.body.token}, (err, token) => {
    if(err || !token) {
      res.status(400).json({message: 'Nieprawidłowy token'});
    } else {
      res.sendStatus(200);
    }
  });
}