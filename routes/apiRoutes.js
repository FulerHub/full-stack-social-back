const express = require('express')
const userRouter = require('./userRouter.js');
const authRouter = require('./authRouter.js');
const dialogsRouter = require('./dialogsRouter.js');
const messagesRouter = require('./messagesRouter.js');
const postsRouter = require('./postsRouter.js');
const subscribersRouter = require('./subscribersRouter.js');
const telegramRouter = require('./telegramRouter.js');


const router = express.Router();


router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/dialogs', dialogsRouter);
router.use('/messages', messagesRouter);
router.use('/posts', postsRouter);
router.use('/subscribers', subscribersRouter);
router.use('/telegram', telegramRouter);

module.exports = router;