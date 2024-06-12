const mongoose = require('mongoose');

const InviteCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
      },
});

const InviteCode = mongoose.model("inviteCodes", InviteCodeSchema);
module.exports = InviteCode;