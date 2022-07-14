const SubscribersController = require("../controllers/SubscribersController.js");
const roleMiddleWare  = require("../middleWare/roleMiddleWare.js");

const express = require('express')
const router = express.Router();
router.get('/',roleMiddleWare([1,2]),SubscribersController.getMySubscribers);
router.get('/:id',roleMiddleWare([1,2]),SubscribersController.getSubscribers);
router.post('/',roleMiddleWare([1,2]),SubscribersController.addSubscriber);
router.delete('/:id',roleMiddleWare([1,2]),SubscribersController.deleteFriend);

module.exports = router;
