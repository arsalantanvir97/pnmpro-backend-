import express from 'express'
const router = express.Router()
import {
  bookaRide,
  rideDetails,
  acceptRide,
  rejectRide,
  userRides,
  driverRides,
  cancelRides,
  startRide,
  reportRide,
  addreview,
  pauseRide,
  resumeRide,
  requestTrack,
  addnewsong,
  driverSongs,
  userSongs,
  getUserRideMusic,
  markRidePaid,
  endRide,
  submitAmount,
  addToWallet,
  getDriverRating,
  getRatingData,
  incomingRideDetails,
} from '../controllers/RideController'
import { protect } from '../middlewares/authMIddleware.js'

router.post('/bookaRide', protect, bookaRide)
router.get('/rideDetails/:id', protect, rideDetails)
router.get('/acceptRide/:id', protect, acceptRide)
router.post('/rejectRide/:id', protect, rejectRide)
router.get('/userRides', protect, userRides)
router.get('/driverRides', protect, driverRides)
router.post('/cancelRides/:id', protect, cancelRides)
router.get('/startRide/:id', protect, startRide)
router.post('/reportRide/:id', protect, reportRide)
router.post('/addreview', protect, addreview)
router.post('/pauseRide/:id', protect, pauseRide)
router.post('/resumeRide/:id', protect, resumeRide)
router.get('/requestTrack/:id', protect, requestTrack)
router.post('/addnewsong', protect, addnewsong)
router.get('/driverSongs', protect, driverSongs)
router.get('/userSongs', protect, userSongs)
router.get('/getUserRideMusic/:id', protect, getUserRideMusic)
router.get('/markRidePaid/:id', protect, markRidePaid)
router.post('/endRide/:id', protect, endRide)
router.post('/submitAmount/:id', protect, submitAmount)
router.get('/addToWallet/:id', protect, addToWallet)
router.get('/getDriverRating', protect, getDriverRating)
router.get('/getRatingData/:id', protect, getRatingData)
router.get('/incomingRideDetails', protect, incomingRideDetails)

export default router
