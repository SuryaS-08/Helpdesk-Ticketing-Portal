resource "aws_dynamodb_table" "ticket_comments" {
  name         = "${var.project_name}-TicketComments"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "ticket_id"
  range_key    = "comment_timestamp"

  attribute {
    name = "ticket_id"
    type = "S"
  }

  attribute {
    name = "comment_timestamp"
    type = "S"
  }

  tags = { Project = var.project_name }
}

resource "aws_dynamodb_table" "activity_log" {
  name         = "${var.project_name}-ActivityLog"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "ticket_id"
  range_key    = "event_timestamp"

  attribute {
    name = "ticket_id"
    type = "S"
  }

  attribute {
    name = "event_timestamp"
    type = "S"
  }

  tags = { Project = var.project_name }
}
