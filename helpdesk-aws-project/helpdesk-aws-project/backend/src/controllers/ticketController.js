const ticketModel = require("../models/ticketModel");
const { logActivity } = require("../models/activityLogModel");
const { publishTicketAlert } = require("../utils/sns");

const HIGH_PRIORITY = ["High", "Critical"];

async function createTicket(req, res) {
  try {
    const { title, description, priority, projectId } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "title and description are required" });
    }

    const ticket = await ticketModel.createTicket({
      title,
      description,
      priority,
      projectId,
      createdBy: req.user.id,
    });

    await logActivity({
      ticketId: ticket.ticket_id,
      actorId: req.user.id,
      action: "TICKET_CREATED",
      details: `Ticket "${title}" created with priority ${ticket.priority}`,
    });

    // Notify admins on every new ticket, and call out high/critical priority explicitly.
    const urgent = HIGH_PRIORITY.includes(ticket.priority);
    await publishTicketAlert({
      subject: urgent
        ? `[URGENT] New ${ticket.priority} ticket #${ticket.ticket_id}`
        : `New ticket #${ticket.ticket_id} created`,
      message:
        `Ticket #${ticket.ticket_id}: "${title}"\n` +
        `Priority: ${ticket.priority}\n` +
        `Raised by user ID: ${req.user.id}\n\n${description}`,
      ticketId: ticket.ticket_id,
      priority: ticket.priority,
    });

    return res.status(201).json({ ticket });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create ticket" });
  }
}

async function listTickets(req, res) {
  try {
    const tickets = await ticketModel.listTicketsForUser({
      userId: req.user.id,
      role: req.user.role,
    });
    return res.json({ tickets });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch tickets" });
  }
}

async function getTicket(req, res) {
  try {
    const ticket = await ticketModel.getTicketById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    // Users may only view their own tickets; agents only their assigned ones.
    if (
      req.user.role === "user" && ticket.created_by !== req.user.id ||
      req.user.role === "agent" && ticket.assigned_to !== req.user.id
    ) {
      return res.status(403).json({ error: "You do not have access to this ticket" });
    }

    return res.json({ ticket });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch ticket" });
  }
}

async function updateTicket(req, res) {
  try {
    const ticketId = req.params.id;
    const existing = await ticketModel.getTicketById(ticketId);
    if (!existing) return res.status(404).json({ error: "Ticket not found" });

    const { status, priority, assignedTo } = req.body;
    const updated = await ticketModel.updateTicket(ticketId, {
      status,
      priority,
      assigned_to: assignedTo,
    });

    const changes = [];
    if (status && status !== existing.status) changes.push(`status ${existing.status} -> ${status}`);
    if (priority && priority !== existing.priority) changes.push(`priority ${existing.priority} -> ${priority}`);
    if (assignedTo && assignedTo !== existing.assigned_to) changes.push(`reassigned to user ${assignedTo}`);

    if (changes.length) {
      await logActivity({
        ticketId,
        actorId: req.user.id,
        action: "TICKET_UPDATED",
        details: changes.join("; "),
      });
    }

    // Escalate immediately if priority just moved into High/Critical.
    const justBecameUrgent =
      priority && HIGH_PRIORITY.includes(priority) && priority !== existing.priority;

    if (justBecameUrgent) {
      await publishTicketAlert({
        subject: `[ESCALATION] Ticket #${ticketId} is now ${priority}`,
        message: `Ticket #${ticketId} ("${existing.title}") priority changed to ${priority} by user ${req.user.id}.`,
        ticketId,
        priority,
      });
    }

    return res.json({ ticket: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update ticket" });
  }
}

module.exports = { createTicket, listTickets, getTicket, updateTicket };
