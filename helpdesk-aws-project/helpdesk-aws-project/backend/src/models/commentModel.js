const { PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const { ddbDocClient } = require("../config/aws");

const TABLE = process.env.DYNAMODB_COMMENTS_TABLE;

async function addComment({ ticketId, authorId, authorName, message }) {
  const item = {
    ticket_id: String(ticketId),
    comment_timestamp: new Date().toISOString(),
    comment_id: uuidv4(),
    author_id: authorId,
    author_name: authorName,
    message,
  };

  await ddbDocClient.send(new PutCommand({ TableName: TABLE, Item: item }));
  return item;
}

async function listComments(ticketId) {
  const result = await ddbDocClient.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "ticket_id = :tid",
      ExpressionAttributeValues: { ":tid": String(ticketId) },
      ScanIndexForward: true, // oldest first
    })
  );
  return result.Items || [];
}

module.exports = { addComment, listComments };
