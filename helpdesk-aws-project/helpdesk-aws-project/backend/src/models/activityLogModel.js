const { PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { ddbDocClient } = require("../config/aws");

const TABLE = process.env.DYNAMODB_ACTIVITY_TABLE;

async function logActivity({ ticketId, actorId, action, details }) {
  const item = {
    ticket_id: String(ticketId),
    event_timestamp: new Date().toISOString(),
    actor_id: actorId,
    action, // e.g. "TICKET_CREATED", "STATUS_CHANGED", "PRIORITY_CHANGED", "COMMENT_ADDED"
    details,
  };

  await ddbDocClient.send(new PutCommand({ TableName: TABLE, Item: item }));
  return item;
}

async function getActivityLog(ticketId) {
  const result = await ddbDocClient.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "ticket_id = :tid",
      ExpressionAttributeValues: { ":tid": String(ticketId) },
      ScanIndexForward: true,
    })
  );
  return result.Items || [];
}

module.exports = { logActivity, getActivityLog };
