import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', function(next) {
  if(!this.isNew) return next();
  bcrypt.hash(this.password, 10, (err, hash) => {
    this.password = hash;
    next();
  })
});

userSchema.methods.comparePassword = function(pass, cb) {
  bcrypt.compare(pass, this.password, (err, isMatch) => {
    if(err) return cb(err);
    cb(null, isMatch);
  });
}

export const User = mongoose.model('User', userSchema, 'users');