const DialogsController = require("../controllers/DialogsController.js");
const roleMiddleWare  = require("../middleWare/roleMiddleWare.js");

const express = require('express')
const router = express.Router();

router.get('/',roleMiddleWare([1,2]),DialogsController.getDialogs)
router.get('/:id',roleMiddleWare([1,2]),DialogsController.getDialog)
router.post('/',roleMiddleWare([1,2]),DialogsController.addDialog)
router.delete('/:id',roleMiddleWare([1,2]),DialogsController.deleteDialog)

module.exports = router;