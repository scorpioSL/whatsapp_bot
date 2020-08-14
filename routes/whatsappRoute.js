const express = require("express");
const router = express.Router();
const WhatsappBot = require('../controllers/WhatsappBot');

router.post('/sms', WhatsappBot.orderResponse);

module.exports = router;