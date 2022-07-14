const MessagesController = require("../controllers/MessagesController.js");
const roleMiddleWare  = require("../middleWare/roleMiddleWare.js");

const express = require('express')
const router = express.Router();

router.get('/:dialogID',roleMiddleWare([1,2]),MessagesController.getMessagesDialog)
router.post('/',roleMiddleWare([1,2]),MessagesController.addMessageToDialog)
router.put('/:id',roleMiddleWare([1,2]),MessagesController.updateMessage)
router.delete('/:id',roleMiddleWare([1,2]),MessagesController.deleteMessage)

module.exports = router;