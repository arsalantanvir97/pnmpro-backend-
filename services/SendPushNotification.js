import session from "../models/SessionModel";
import FCM from "fcm-node";
const serverKey =
  "AAAAASS08F8:APA91bELDIufJcBeT7Pt7PlWmOZ1oQ5ASHh-HoJFx42wbWpAvTPmuxak-_kRkDEvSGAI6gIju_1ysWGATXIwPTmQ80YehegWJlwfZsnDAgNDSHHUW28sufNDEoVxJI4QRiKROca0OaiG";
const fcm = new FCM(serverKey);

 const SendPushNotification = async (notification) => {
  console.log('notification',notification)
  const Session = await session.find({user:notification.userId});
  console.log('Session',Session)
  const deviceTokens = [];
  Session.forEach(Sesssion=>(deviceTokens.push(Sesssion.deviceId)))
  console.log('deviceTokensdeviceTokens',deviceTokens)
  // if (Session.deviceId) deviceTokens.push(user.device_id);
  const message = {
    registration_ids: deviceTokens,
    collapse_key: "your_collapse_key",
    notification: {
      title: notification.title,
      body: notification.body,
    },
    data: notification.payload,
  };

  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong! ", err);
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};
export default SendPushNotification