import bcrypt from 'bcrypt-nodejs';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
	username: { type: String, unique: true },

	firstName: { type: String, default: '' },
	lastName: { type: String, default: '' },
	gender: { type: String, default: '' },
	country: { type: String, default: '' },
	birthDate: { type: Date, default: Date.now },
	birthDateDay: { type: Number },
	birthDateMonth: { type: Number },
	birthDateYear: { type: Number },
	age: { type: Number, min: 0, max: 120 },
	about: { type: String, default: '' },
	city: { type: String, default: '' },
	position: { type: String, default: '' },
	domain: { type: String, default: '' },
	schoolName: { type: String, default: '' },

	avatarsSrc: [{
		avatarId: Number,
		avatar150: String,
		avatar80: String,
		avatar28: String,
		provider: { type: String, default: 'local' }
	}],

	avatarMainSrc: {
		avatarId: { type: Number, default: -1 },
		avatar150: { type: String, default: '' },
		avatar80: { type: String, default: '' },
		avatar28: { type: String, default: '' },
		provider: { type: String, default: 'local' }
	},

	votedCourses: [{
		courseId: { type: String },
		at: { type: Date, default: null }
	}],

  tokens: Array,
	provider: { type: String, default: 'local' },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  google: {},
	facebook: {}
});

// AuthPassport:
function encryptPassword(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  return bcrypt.genSalt(5, (saltErr, salt) => {
    if (saltErr) return next(saltErr);
    return bcrypt.hash(user.password, salt, null, (hashErr, hash) => {
      if (hashErr) return next(hashErr);
      user.password = hash;
      return next();
    });
  });
}

/*
 * Password hash middleware.
 */
UserSchema.pre('save', encryptPassword);

/*
 AuthPassport: Defining our own custom document instance method
 */
UserSchema.methods = {
  comparePassword(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) return cb(err);
      return cb(null, isMatch);
    });
  }
};

UserSchema.statics = {};

export default mongoose.model('User', UserSchema);
