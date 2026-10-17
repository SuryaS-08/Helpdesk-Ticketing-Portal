resource "aws_iam_role" "app_role" {
  name = "${var.project_name}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "app_policy" {
  name = "${var.project_name}-app-policy"
  role = aws_iam_role.app_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "DynamoDBAccess",
        Effect = "Allow",
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ],
        Resource = [
          aws_dynamodb_table.ticket_comments.arn,
          aws_dynamodb_table.activity_log.arn,
          "${aws_dynamodb_table.ticket_comments.arn}/index/*",
          "${aws_dynamodb_table.activity_log.arn}/index/*"
        ]
      },
      {
        Sid      = "SNSPublish",
        Effect   = "Allow",
        Action   = ["sns:Publish"],
        Resource = aws_sns_topic.helpdesk_alerts.arn
      },
      {
        Sid    = "CloudWatchLogs",
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_instance_profile" "app_profile" {
  name = "${var.project_name}-ec2-profile"
  role = aws_iam_role.app_role.name
}
