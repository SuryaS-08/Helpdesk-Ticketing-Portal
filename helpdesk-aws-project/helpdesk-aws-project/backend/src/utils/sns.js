const { PublishCommand } = require("@aws-sdk/client-sns");
const { snsClient } = require("../config/aws");

const TOPIC_ARN = process.env.SNS_TOPIC_ARN;

/**
 * Publishes a ticket-related alert to the HelpdeskAlerts SNS topic.
 * Fans out to every subscribed endpoint (admin/agent email, SMS, etc).
 */
async function publishTicketAlert({ subject, message, ticketId, priority }) {
  if (!TOPIC_ARN) {
    console.warn("SNS_TOPIC_ARN not set - skipping notification for ticket", ticketId);
    return;
  }

  const command = new PublishCommand({
    TopicArn: TOPIC_ARN,
    Subject: subject.slice(0, 100), // SNS subject limit
    Message: message,
    MessageAttributes: {
      ticketId: { DataType: "String", StringValue: String(ticketId) },
      priority: { DataType: "String", StringValue: priority || "Medium" },
    },
  });

  try {
    await snsClient.send(command);
  } catch (err) {
    // Never let a notification failure break the main ticket flow.
    console.error("SNS publish failed:", err.message);
  }
}

module.exports = { publishTicketAlert };
