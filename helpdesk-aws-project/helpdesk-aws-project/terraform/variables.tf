variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Prefix used to name all resources"
  type        = string
  default     = "helpdesk-portal"
}

variable "ec2_instance_type" {
  type    = string
  default = "t2.micro"
}

variable "ec2_key_name" {
  description = "Existing EC2 key pair name for SSH access"
  type        = string
}

variable "db_username" {
  type    = string
  default = "helpdesk_admin"
}

variable "db_password" {
  description = "Master password for RDS (min 8 chars). Pass via terraform.tfvars or -var, never commit it."
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  type    = string
  default = "db.t3.micro"
}

variable "alert_email" {
  description = "Email address that receives SNS ticket alerts"
  type        = string
}

variable "ssh_ingress_cidr" {
  description = "CIDR allowed to SSH into the EC2 instance"
  type        = string
  default     = "0.0.0.0/0"
}
