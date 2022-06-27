import Notification from "../models/NotificationModel.js";

const CreateNotification = async (data) => {
  try {
    const { notifiableId, notificationType, title, body, payload } = data;

    const notification = new Notification({
      notifiableId: notifiableId,
      notificationType: notificationType,
      title: title,
      body: body,
      payload: payload,
    });

    await notification.save();
  } catch (error) {
    console.log(error);
  }
};
export default CreateNotification;
