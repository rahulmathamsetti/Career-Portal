const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// Create Schema
const ApplicantSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	date:{
		type: Date,
		default: Date.now
	},
	rating:{
		type:Number,
		default: 0,
	},
	education : [{
		institute: {
			type: String,
			// required: true
		},
		start: {
			type: String,
			// required: true
		},
		end: {
			type: String,
			// required:true,
		}
		 }],
	skills: {
		type:[String]
	}
});

ApplicantSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
     
ApplicantSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = Applicant = mongoose.model("Applicant", ApplicantSchema);
