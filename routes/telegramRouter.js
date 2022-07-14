const TelegramController = require("../controllers/TelegramController.js");
const roleMiddleWare  = require("../middleWare/roleMiddleWare.js");

const express = require('express')
const router = express.Router();

router.get('/',roleMiddleWare([1,2]), TelegramController.getPosts);

module.exports = router;