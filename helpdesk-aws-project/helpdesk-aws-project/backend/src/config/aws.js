const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { SNSClient } = require("@aws-sdk/client-sns");
require("dotenv").config();

// No access keys here on purpose: when this app runs on the EC2 instance
// created by terraform/ec2.tf, it picks up credentials automatically from
// the attached IAM instance profile (aws_iam_instance_profile.app_profile).
const region = process.env.AWS_REGION || "ap-south-1";

const ddbClient = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const snsClient = new SNSClient({ region });

module.exports = { ddbDocClient, snsClient, region };
