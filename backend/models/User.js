const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true,
        unique: true
    },
    address:{
      type: String,
      required: true,
      unique: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    balance:{
        type: Number,
        default: 500
    }
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);
