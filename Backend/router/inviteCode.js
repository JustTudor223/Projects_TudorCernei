const express = require("express");
const router = express.Router();
const inviteCode = require("../controller/inviteCode");

// Check Invite Code
router.get("/checkInviteCode/:code", inviteCode.checkInviteCode);

// Add Invite Code
router.post("/addCode", inviteCode.addCode);

// Remove Invite Code
router.delete("/removeCode/:code", inviteCode.removeCode);

// Get All Invite Codes
router.get("/getAllCodes", inviteCode.getAllCodes);

module.exports = router;