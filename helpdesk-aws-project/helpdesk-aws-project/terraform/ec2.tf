resource "aws_instance" "app_server" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.ec2_instance_type
  key_name               = var.ec2_key_name
  subnet_id              = data.aws_subnets.default.ids[0]
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  iam_instance_profile   = aws_iam_instance_profile.app_profile.name

  user_data = templatefile("${path.module}/../backend/deploy/ec2-user-data.sh.tpl", {
    db_host     = aws_db_instance.helpdesk_db.address
    db_name     = aws_db_instance.helpdesk_db.db_name
    db_user     = var.db_username
    db_password = var.db_password
    sns_topic_arn = aws_sns_topic.helpdesk_alerts.arn
    aws_region  = var.aws_region
  })

  tags = { Name = "${var.project_name}-app-server" }

  depends_on = [aws_db_instance.helpdesk_db]
}
