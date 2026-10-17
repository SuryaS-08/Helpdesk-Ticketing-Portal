#!/bin/bash
# Bootstrap script for the Helpdesk Ticketing Portal EC2 app server.
# Rendered by Terraform (terraform/ec2.tf) with DB/SNS values baked in as env vars.
set -euxo pipefail

# --- Install Node.js 20 + git ---
dnf install -y git
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs

APP_DIR=/opt/helpdesk-portal
mkdir -p $APP_DIR

# In real deployment: replace this with `git clone <your repo> $APP_DIR`
# or `aws s3 cp s3://your-bucket/backend.zip .` then unzip.
# For now this script assumes the backend/ folder is uploaded to $APP_DIR by your CI/CD.

cat > $APP_DIR/.env <<EOF
PORT=3000
JWT_SECRET=$(openssl rand -hex 32)
AWS_REGION=${aws_region}
SNS_TOPIC_ARN=${sns_topic_arn}
DYNAMODB_COMMENTS_TABLE=helpdesk-portal-TicketComments
DYNAMODB_ACTIVITY_TABLE=helpdesk-portal-ActivityLog
DB_HOST=${db_host}
DB_PORT=5432
DB_NAME=${db_name}
DB_USER=${db_user}
DB_PASSWORD=${db_password}
EOF

cd $APP_DIR
npm install --production
npm run migrate

# --- systemd service so the app survives reboots/crashes ---
cp deploy/helpdesk.service /etc/systemd/system/helpdesk.service
systemctl daemon-reload
systemctl enable helpdesk
systemctl start helpdesk
