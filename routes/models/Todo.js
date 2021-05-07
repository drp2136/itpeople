'use strict';
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

// Model Object.
let TodoSchema = new Schema({
    name: { type: String, trim: true },
    title: { type: String, trim: true },
    text: { type: String, trim: true },
    dates: {
        start: Date,
        end: Date
    },

    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'users' },
}, { timestamps: true });

TodoSchema.index({ title: 1 });


module.exports = Mongoose.model('todos', TodoSchema);
