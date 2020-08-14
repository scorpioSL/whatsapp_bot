const express = require("express");
const router = express.Router();
const dailyPromotion = require('../controllers/dailyPromotionController');

router.get('/daily', dailyPromotion.daily);

module.exports = router;