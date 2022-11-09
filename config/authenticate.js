import passport from 'passport';

export const authenticate = (req, res, next) =>
  passport.authenticate('jwt', {session: false}, (err, user, challenges) => {
    if (err || !user || challenges) {
      return res
        .status(401)
        .json(err || challenges)
        .end();
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);