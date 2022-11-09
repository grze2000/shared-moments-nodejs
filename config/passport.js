import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User } from "../models/User";

const config = passport => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = process.env.SECRET;
  passport.use(new JwtStrategy(options, (jwtPayload, done) => {
    User.findOne({_id: jwtPayload.id}, (err, user) => {
      if(err) return done(err, false);
      if(user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }))
}

module.exports = config;