// Data model
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Schema is used to create objects
let Schema = mongoose.Schema;

let ValidRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
}

// Need to define rules, fields and controls
let userScheme = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: ValidRoles
            // required: true -> Not necessary if exists default
    },
    estado: {
        type: Boolean,
        default: true
            // required: false
    },
    google: {
        type: Boolean,
        default: false
    }
});

// Delete password field
userScheme.methods.toJSON = function() { // No arrow function cuz we need the keyword "this"
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

userScheme.plugin(uniqueValidator, {
    message: '{PATH} email already exists'
})

module.exports = mongoose.model('User', userScheme) // Real name in DB