import session from "../models/SessionModel";
import FCM from "fcm-node";
const serverKey =
  "AAAAXHWfo-0:APA91bGZbTUNIS9eBEoY-jnCvx75XSL_s1dwkt8zDt-O5FmVy83PQurYxt1kPToMj1FXMwcKcDhmPUv3VZNvQOAmTH9IdVz3UIkJynlOR9sfXaaNyeBpNT5kRwcUrxiAF3PiUq_Dsc78";
const fcm = new FCM(serverKey);

const SendPushNotification2 = async (notification) => {
  console.log("notification", notification);
  const Session = await session.find({ user: notification.userId });
  console.log("Session", Session);
  const deviceTokens = [];
  Session.forEach((Sesssion) => deviceTokens.push(Sesssion.deviceId));
  console.log("deviceTokensdeviceTokens", deviceTokens);
  // if (Session.deviceId) deviceTokens.push(user.device_id);
  const message = {
    registration_ids: deviceTokens,
    collapse_key: "your_collapse_key",
    notification: {
      title: notification.title,
      body: notification.body
    },
    data: notification.payload
  };

  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong! ", err);
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};
export default SendPushNotification2;
