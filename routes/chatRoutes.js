import express from 'express'
const router = express.Router()

import {
  getFriends,
  makeFriends,
  getMessages,
  sendMessage,
} from '../controllers/chatController'
import { protect } from '../middlewares/authMIddleware.js'

// @USER ROUTES
router.post('/user/get-friends', protect, getFriends)
router.post('/user/make-friend', protect, makeFriends)
router.post('/user/get-messages', protect, getMessages)
router.post('/user/send-message', protect, sendMessage)

export default router
