const mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Need to define rules, fields and controls
let categoryScheme = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true, 'Description is necessary']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Category', categoryScheme)