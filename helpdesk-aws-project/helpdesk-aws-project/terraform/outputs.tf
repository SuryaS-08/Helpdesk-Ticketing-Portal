output "app_server_public_ip" {
  value = aws_instance.app_server.public_ip
}

output "api_base_url" {
  value = "http://${aws_instance.app_server.public_ip}:3000/api"
}

output "rds_endpoint" {
  value = aws_db_instance.helpdesk_db.address
}

output "sns_topic_arn" {
  value = aws_sns_topic.helpdesk_alerts.arn
}

output "dynamodb_tables" {
  value = [aws_dynamodb_table.ticket_comments.name, aws_dynamodb_table.activity_log.name]
}
