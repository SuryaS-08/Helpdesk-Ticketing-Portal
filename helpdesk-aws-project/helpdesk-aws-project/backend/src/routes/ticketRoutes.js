const express = require("express");
const { authenticate, requireRole } = require("../middleware/auth");
const ticketController = require("../controllers/ticketController");
const commentController = require("../controllers/commentController");

const router = express.Router();

router.use(authenticate);

router.post("/", ticketController.createTicket); // any authenticated user can raise a ticket
router.get("/", ticketController.listTickets); // filtered by role in the model layer
router.get("/:id", ticketController.getTicket);

// Only agents/admins can change status, priority, or assignment
router.patch("/:id", requireRole("agent", "admin"), ticketController.updateTicket);

router.get("/:id/comments", commentController.getComments);
router.post("/:id/comments", commentController.postComment);

module.exports = router;
