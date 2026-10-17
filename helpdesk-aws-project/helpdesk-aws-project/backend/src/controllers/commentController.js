const { addComment, listComments } = require("../models/commentModel");
const { logActivity } = require("../models/activityLogModel");
const ticketModel = require("../models/ticketModel");

async function postComment(req, res) {
  try {
    const ticketId = req.params.id;
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "message is required" });

    const ticket = await ticketModel.getTicketById(ticketId);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    const comment = await addComment({
      ticketId,
      authorId: req.user.id,
      authorName: req.user.name,
      message,
    });

    await logActivity({
      ticketId,
      actorId: req.user.id,
      action: "COMMENT_ADDED",
      details: `${req.user.name} commented on the ticket`,
    });

    return res.status(201).json({ comment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add comment" });
  }
}

async function getComments(req, res) {
  try {
    const comments = await listComments(req.params.id);
    return res.json({ comments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch comments" });
  }
}

module.exports = { postComment, getComments };
