import BookRide from '../models/RideModel'
import VehicleType from '../models/VehicleTypeModel'
import PromoCode from '../models/PromoCodeModel'
import Driver from '../models/DriverModel'
import SendPushNotification from '../services/SendPushNotification'
import Review from '../models/ReviewModel'
import SoundTrack from '../models/SoundTrackModel'
import Wallet from '../models/WalletModel'
import Payment from '../models/PaymentModel'
import CreateNotification from '../utills/notification'
import SendPushNotification2 from '../services/SendPushNotification2'
import Mongoose from 'mongoose'
const bookaRide = async (req, res) => {
  const {
    paymentMethod,
    vehicletypeid,
    pickuplocation,
    dropofflocation,
    promocode,
    pickup_address,
    dropoff_address,
  } = req.body
  let discountedfare = 0
  let payableamount = 0
  let totalbill = 0

  try {
    const vehicletype = await VehicleType.findById(vehicletypeid)
    totalbill = vehicletype.rate
    payableamount = vehicletype.rate

    if (promocode) {
      const promoCode = await PromoCode.findById(promocode)
      discountedfare = promoCode.discount
      payableamount = payableamount / promoCode.discount
    }
    //  else if (walletpriority) {
    //   const wallet = await Wallet.findOne({ user: req.id });
    //   if (wallet.amount >= totalbill) {
    //     wallet.amount = wallet.amount - totalbill;
    //     await wallet.save();
    //   } else {
    //     return await res.status(203).json({
    //       message: "No enough amount in wallet to book this ride"
    //     });
    //   }
    // }
    const createBookRide = await BookRide.create({
      paymentMethod: req.body.walletpriority ? 'Wallet' : paymentMethod,
      vehicletype,
      pickup_address,
      payableamount,
      walletpriority: req.body.walletpriority ? req.body.walletpriority : false,
      dropoff_address,
      pickuplocation: {
        type: 'Point',
        coordinates: [pickuplocation[1], pickuplocation[0]],
      },
      dropofflocation: {
        type: 'Point',
        coordinates: [dropofflocation[1], dropofflocation[0]],
      },
      isPaid: true,
      estimatedfare: vehicletype.rate,
      totalbill,
      discountedfare,
      user: req.id,
    })
    await createBookRide.save()
    // const payment = await Payment.create({
    //   date: new Date(),
    //   ride: createBookRide._id,
    //   user: req.id
    // });
    // await payment.save();
    console.log('pickuplocation', pickuplocation)
    let driverid = []
    const driver = await Driver.find({
      $and: [
        { flag: false },
        {
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [pickuplocation[1], pickuplocation[0]],
              },
              $maxDistance: 7000,
            },
          },
        },
      ],
    })
    driver.map((drive) => driverid.push(drive._id))
    createBookRide.drivers = driverid
    await createBookRide.save()
    console.log('driverid0', driverid)
    await SendPushNotification({
      title: 'Incoming Ride',
      body: `A user having id ${req.id} wants to book a ride of id: ${createBookRide._id}`,
      payload: {
        payloadType: 'Ride',
        id: createBookRide._id,
      },
      userId: driverid,
    })
    // const notification = {
    //   notifiableId: null,
    //   notificationType: "Incoming Ride",
    //   title: "Incoming Ride",
    //   body: `A user having id of ${req.id} wants to book a ride of id: ${createBookRide._id}`,
    //   payload: {
    //     type: "Ride",
    //     id: driverid
    //   }
    // };
    // CreateNotification(notification);
    const ride = await BookRide.findById(createBookRide._id)
      .populate({
        path: 'user vehicletype driver',
        populate: {
          path: 'drivervehicletype',
          populate: {
            path: 'vehicletype',
          },
        },
      })
      .select('-password')
      .lean()
    await res.status(201).json({
      createBookRide: ride,
    })
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}

const rideDetails = async (req, res) => {
  try {
    const ride = await BookRide.findById(req.params.id)
      .populate({
        path: 'user vehicletype driver',
        populate: {
          path: 'drivervehicletype',
          populate: {
            path: 'vehicletype',
          },
        },
      })
      .select('-password')
      .lean()

    res.status(201).json({
      ride,
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}
const incomingRideDetails = async (req, res) => {
  try {
    console.log('req.id', req.id)
    const rides = await BookRide.find({
      $and: [
        { rideStatus: 'Pending' },
        { drivers: { $in: req.id } },
        // { _id: req.params.id },
      ],
    })
      .populate({
        path: 'user vehicletype driver',
        populate: {
          path: 'drivervehicletype',
          populate: {
            path: 'vehicletype',
          },
        },
      })
      .select('-password')
      .lean()

    res.status(201).json({
      rides,
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}
const acceptRide = async (req, res) => {
  try {
    const ride = await BookRide.findById(req.params.id)
    console.log('re', ride)
    if (ride.driver) {
      return res.status(202).json({
        message: 'Ride already accepted by a driver',
      })
    }
    ride.rideStatus = 'Accepted'
    ride.driver = req.id
    await ride.save()
    await Driver.findOneAndUpdate(
      { _id: req.id },
      {
        flag: true,
      },
      { new: true, upsert: true, returnNewDocument: true }
    )
    await SendPushNotification2({
      title: 'Ride Accepted',
      body: `A driver having id ${req.id} have accepted your ride`,
      payload: {
        payloadType: 'Ride',
        id: ride._id,
      },
      userId: ride.user,
    })
    const notification = {
      notifiableId: null,
      notificationType: 'Ride Accepted',
      title: 'Ride Accepted',
      body: `A driver having id ${req.id} have accepted your ride`,
      payload: {
        type: 'Ride',
        id: ride.user,
      },
    }
    CreateNotification(notification)
    res.status(201).json({
      message: 'Ride Accepted',
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}

const rejectRide = async (req, res) => {
  const { rejeciontReason, rideid } = req.body
  const ride = await BookRide.findById(rideid)
  ride.rideStatus = 'Rejected'
  ride.rejeciontReason = rejeciontReason
  await ride.save()

  try {
    res.status(201).json({
      message: 'Ride Rejected',
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}

const reportRide = async (req, res) => {
  const { reportReason } = req.body

  try {
    const ride = await BookRide.findById(req.params.id)
    ride.rideStatus = 'Reported'
    ride.reportReason = reportReason
    await ride.save()
    res.status(201).json({
      message: 'Ride Reported',
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}

const userRides = async (req, res) => {
  console.log('req.id', req.id)
  try {
    const ride = await BookRide.find({ user: req.id })
      .populate({
        path: 'user vehicletype driver',
        populate: {
          path: 'drivervehicletype',
          populate: {
            path: 'vehicletype',
          },
        },
      })
      .sort({ $natural: -1 })

    res.status(201).json({
      ride,
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}

const driverRides = async (req, res) => {
  try {
    const ride = await BookRide.find({ driver: req.id }).populate({
      path: 'user vehicletype driver',
      populate: {
        path: 'drivervehicletype',
        populate: {
          path: 'vehicletype',
        },
      },
    })
    res.status(201).json({
      ride,
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}

const cancelRides = async (req, res) => {
  const { rejectReason } = req.body
  try {
    const ride = await BookRide.findById(req.params.id)
    ride.rideStatus = 'Cancelled'
    ride.rejectReason = rejectReason

    await ride.save()
    await Driver.findOneAndUpdate(
      { _id: ride.driver },
      {
        flag: false,
      },
      { new: true, upsert: true, returnNewDocument: true }
    )
    res.status(201).json({
      message: 'Ride Cancelled',
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}

const startRide = async (req, res) => {
  try {
    const ride = await BookRide.findById(req.params.id)
    ride.rideStatus = 'Started'

    await ride.save()
    await SendPushNotification2({
      title: 'Ride Started',
      body: `A driver having id ${req.id} have started the ride`,
      payload: {
        payloadType: 'Ride',
        id: ride._id,
      },
      userId: ride.user,
    })
    res.status(201).json({
      message: 'Ride Started',
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}

const addreview = async (req, res) => {
  try {
    const { rating, review, ride } = req.body
    const ridee = await BookRide.findOne({ _id: ride })
    const reviewExist = await Review.findOne({ user: req.id, ride })
    if (reviewExist) {
      return res.status(409).json({ message: 'You already reviewed this Ride' })
    }

    const newReview = await Review.create({
      rating: Number(rating),
      review,
      ride,
      driver: ridee.driver,
      user: req.id,
    })
    await newReview.save()
    res.status(201).json({
      newReview,
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}

const pauseRide = async (req, res) => {
  try {
    const ride = await BookRide.findById(req.params.id)
    ride.rideStatus = 'Paused'
    await ride.save()
    await SendPushNotification2({
      title: 'Ride Paused',
      body: `A driver having id ${req.id} have paused your ride`,
      payload: {
        payloadType: 'Ride',
        id: ride._id,
      },
      userId: ride.user,
    })
    res.status(201).json({
      message: 'Ride Paused',
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}

const resumeRide = async (req, res) => {
  try {
    let receipt =
      req.files &&
      req.files.receipt &&
      req.files.receipt[0] &&
      req.files.receipt[0].path
    const ride = await BookRide.findById(req.params.id)

    ride.receipt = receipt
    ride.rideStatus = 'Resumed'

    await ride.save()
    await SendPushNotification2({
      title: 'Ride Resumed',
      body: `A driver having id ${req.id} have resumed the ride`,
      payload: {
        payloadType: 'Ride',
        id: ride._id,
      },
      userId: ride.user,
    })
    res.status(201).json({
      message: 'Ride Resumed',
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}
const requestTrack = async (req, res) => {
  try {
    const ride = await BookRide.findById(req.params.id)
    await SendPushNotification({
      title: 'Request Track',
      body: `User have requested for a soundtrack`,
      payload: {
        payloadType: 'Ride',
        id: ride._id,
      },
      userId: ride.driver,
    })

    res.status(201).json({
      message: 'Request Track',
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}

const addnewsong = async (req, res) => {
  const { songname, artistname, duration, ride } = req.body
  console.log('req.bpdy', req.body)
  try {
    const ridee = await BookRide.findById(ride)
    const sound = await SoundTrack.create({
      songname,
      artistname,
      duration,
      ride,
      driver: ridee.driver,
      user: ridee.user,
    })
    await sound.save()
    await res.status(201).json({
      sound,
    })
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}
const driverSongs = async (req, res) => {
  try {
    const myTrack = await SoundTrack.find({ driver: req.id })
      .select('-ride -driver -user')
      .lean()
    await res.status(201).json({
      myTrack,
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}
const userSongs = async (req, res) => {
  try {
    const myTrack = await SoundTrack.find({ user: req.id })
      .select('-ride -driver -user')
      .lean()
    await res.status(201).json({
      myTrack,
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}
const getUserRideMusic = async (req, res) => {
  try {
    const myTrack = await SoundTrack.find({ user: req.id, ride: req.params.id })
      .select('-ride -driver -user')
      .lean()
    await res.status(201).json({
      myTrack,
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}
const markRidePaid = async (req, res) => {
  try {
    const ride = await BookRide.findById(req.params.id)
    ride.isPaid = true
    // ride.rideStatus='Completed'
    await ride.save()
    res.status(201).json({
      message: 'Mark Paid',
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}
const endRide = async (req, res) => {
  try {
    const { rating, review } = req.body

    const ride = await BookRide.findById(req.params.id)
    const reviewExist = await Review.findOne({ user: req.id, ride: ride._id })
    if (reviewExist) {
      return res.status(409).json({ message: 'You already reviewed this Ride' })
    }

    const newReview = await Review.create({
      rating: Number(rating),
      review,
      ride: ride._id,
      driver: ride.driver,
      user: req.id,
    })
    await newReview.save()
    ride.rideStatus = 'Completed'
    if (ride.walletpriority) {
      const wallet = await Wallet.findOne({ user: ride.user })
      if (wallet.amount >= payableamount) {
        ride.payableamount = 0
        ride.rideStatus = 'Paid'
        const payment = await Payment.create({
          date: new Date(),
          ride: ride._id,
          user: ride.user,
          driver: ride.driver,
        })
        await payment.save()
      }
      wallet.amount = wallet.amount - payableamount
      ride.payableamount = ride.payableamount - wallet.amount
      await wallet.save()
    }
    await Driver.findOneAndUpdate(
      { _id: ride.driver },
      {
        flag: false,
      },
      { new: true, upsert: true, returnNewDocument: true }
    )
    // ride.rideStatus='Completed'
    await ride.save()
    res.status(201).json({
      message: 'Ride Ended',
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}
const submitAmount = async (req, res) => {
  try {
    const ride = await BookRide.findById(req.params.id)
    let recievedAmount = Number(req.body.recievedAmount)
    recievedAmount = recievedAmount - ride.payableamount
    ride.payableamount = 0
    if (req.body.returnwallet) {
      const wallet = await Wallet.findOne({ user: ride.user })
      wallet.amount = wallet.amount + recievedAmount
      await wallet.save()
    }
    await payment.save()
    ride.rideStatus = 'Paid'
    await ride.save()
    const payment = await Payment.create({
      date: new Date(),
      ride: ride._id,
      user: ride.user,
      driver: ride.driver,
    })
    await payment.save()

    res.status(201).json({
      message: 'Submit Amount',
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}

const addToWallet = async (req, res) => {
  try {
    const ride = await BookRide.findById(req.params.id)
    const wallet = await Wallet.findOne({ user: ride.user })
    if (wallet) {
      wallet.amount = wallet.amount + ride.recievedAmount
      // ride.rideStatus='Completed'
      await wallet.save()
    }
    res.status(201).json({
      message: 'Amount Returned',
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}
const getDriverRating = async (req, res) => {
  try {
    const rating = await Review.find({ driver: req.id })
      .populate('user ride driver')
      .select('-password')
      .lean()

    let reviewCount = await Review.aggregate([
      { $match: { driver: Mongoose.mongo.ObjectId(req.id) } },

      {
        $group: {
          _id: '$rating',
          totalRating: { $sum: 1 },
          // avgrating: { $avg: "$rating" }

          //   totalRating: { $sum:"$rating" },
          //   detail: { $first: '$$ROOT' },
        },
      },
      { $sort: { _id: -1 } },
    ])
    let averagerating = 0
    let avgratediviser = 0
    reviewCount.map((avg) => {
      averagerating += avg._id * avg.totalRating
      avgratediviser += avg.totalRating
    })
    const arr = [
      {
        _id: 5,
        totalRating: 0,
      },
      {
        _id: 4,
        totalRating: 0,
      },
      {
        _id: 3,
        totalRating: 0,
      },
      {
        _id: 2,
        totalRating: 0,
      },
      {
        _id: 1,
        totalRating: 0,
      },
    ]
    reviewCount.forEach((data) => {
      arr.forEach((dataa, index) => {
        if (data._id == dataa._id) {
          arr[index] = {
            _id: dataa._id,
            totalRating: data.totalRating,
          }
        }
      })
    })
    console.log('reviewCount', reviewCount, averagerating / avgratediviser)
    await res.status(201).json({
      rating,
      averagerating: averagerating / avgratediviser,
      reviewCount: arr,
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}
const getRatingData = async (req, res) => {
  try {
    const rating = await Review.findOne({ ride: req.params.id })
      .populate('user ride driver')
      .select('-password')
      .lean()
    await res.status(201).json({
      rating,
    })
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    })
  }
}

export {
  markRidePaid,
  submitAmount,
  getRatingData,
  addToWallet,
  getDriverRating,
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
  getUserRideMusic,
  endRide,
  incomingRideDetails,
  userSongs,
}
