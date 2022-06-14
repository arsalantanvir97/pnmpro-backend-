import Feedback from "../models/FeedbackModel.js";
import moment from "moment";
import generateEmail from "../services/generate_email.js";

const createFeedback = async (req, res) => {
  const { firstName, lastName, email, message,type } = req.body;
  console.log("req.body", req.body);
  try {
    const feedback = new Feedback(req.body);
    console.log("feedback", feedback);

    const feedbackcreated = await feedback.save();
    console.log("feedbackcreated", feedbackcreated);
    if (feedbackcreated) {
      const html = `<p>A ${type} named ${firstName} ${lastName} having email ${email} have sent you a message.
        \n\n ${message}           
        </p>`;
      await generateEmail("Info@pnmpro.com", "PNMPRO- Contact Us", html);

      res.status(201).json({
        feedbackcreated
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const Feedbacklogs = async (req, res) => {
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ? // { $text: { $search: req.query.searchString } }
        {
          $or: [
            {
              firstName: { $regex: `${req.query.searchString}`, $options: "i" }
            },
            {
              lastName: { $regex: `${req.query.searchString}`, $options: "i" }
            },
            { type: { $regex: `${req.query.searchString}`, $options: "i" } }
          ]
        }
      : {};
    const status_filter = req.query.status ? { status: req.query.status } : {};
    const from = req.query.from;
    const to = req.query.to;
    let dateFilter = {};
    if (from && to)
      dateFilter = {
        createdAt: {
          $gte: moment.utc(new Date(from)).startOf("day"),
          $lte: moment.utc(new Date(to)).endOf("day")
        }
      };

    const feedback = await Feedback.paginate(
      {
        ...searchParam,
        ...status_filter,
        ...dateFilter
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id"
      }
    );
    await res.status(200).json({
      feedback
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getFeedbackDetails = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .lean()
      .select("-password");
    await res.status(201).json({
      feedback
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export { createFeedback, Feedbacklogs, getFeedbackDetails };
