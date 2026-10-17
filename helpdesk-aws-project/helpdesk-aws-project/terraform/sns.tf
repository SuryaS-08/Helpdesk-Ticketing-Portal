resource "aws_sns_topic" "helpdesk_alerts" {
  name = "${var.project_name}-HelpdeskAlerts"
}

resource "aws_sns_topic_subscription" "admin_email" {
  topic_arn = aws_sns_topic.helpdesk_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}
