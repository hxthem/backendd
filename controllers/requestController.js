const { Request } = require("../models");

exports.sendRequest = async (req, res) => {
  const { skillId, recipientId, duration, message } = req.body;
  const senderId = req.user.id;

  try {
    const newRequest = await Request.create({
      skillId,
      recipientId,
      duration,
      message,
      senderId,
      status: "pending"
    });

    res.status(201).json({ message: "Request sent", request: newRequest });
  } catch (err) {
    res.status(500).json({ error: "Failed to send request" });
  }
};
