const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: 'String',
    lastName : 'String',
    email: 'String',
    password: 'String',
    phoneNumber: 'Number',
    imageUrl: 'String',
    isAdmin: { type: 'Boolean', default: false },
});

const User = mongoose.model("users", UserSchema);
module.exports = User;