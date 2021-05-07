'use strict';
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let ActivityStatus = {
    lastActivity: { type: Number },
    lastLogin: { type: Number }
};

// Model Object.
let UserSchema = new Schema({
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    password: { type: String, trim: true },
    phone: { type: String },
    dob: Date,
    gender: String,                 // male|female|other
    photoUrl: { type: String, default: '/assets/default/images/avatar.jpg' },
    bio: String,                    // bio of user

    status: { type: String, default: 'Active' },    //  later can make it insctive, and verify
    previousStatus: String,

    type: String,                   // admin|user

    isPhoneVerified: { type: Boolean, default: false },
    activityStatus: ActivityStatus,

    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'users' },
}, { timestamps: true });

UserSchema.index({ email: 1 }, { unique: true });
// UserSchema.index({ phone: 1 });
// UserSchema.index({ status: 1 });

module.exports = Mongoose.model('users', UserSchema);
