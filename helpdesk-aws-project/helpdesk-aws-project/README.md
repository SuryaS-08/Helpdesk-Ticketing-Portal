# Helpdesk Ticketing Portal — AWS Project

A working ticketing system: **Amazon EC2** (Node/Express API) + **Amazon RDS/Postgres**
(users, tickets, projects) + **Amazon DynamoDB** (comments, activity log) + **Amazon SNS**
(new-ticket / high-priority alerts).

```
helpdesk-aws-project/
├── terraform/        # Provisions EC2, RDS, DynamoDB, SNS, IAM on AWS
├── backend/          # Node.js/Express API (the actual application)
│   ├── src/
│   ├── migrations/   # RDS schema
│   └── deploy/       # EC2 bootstrap (user-data) + systemd service
└── frontend/         # Minimal HTML test client (no build step)
```

## 1. Provision AWS infrastructure (Terraform)

```bash
cd terraform
terraform init
terraform apply \
  -var="ec2_key_name=YOUR_EXISTING_KEY_PAIR" \
  -var="db_password=SomeStrongPassword123!" \
  -var="alert_email=you@example.com"
```

This creates:
- An EC2 instance (t2.micro) with an IAM role that can call DynamoDB and SNS — no access keys needed
- An RDS PostgreSQL instance, reachable only from the EC2 security group
- Two DynamoDB tables: `TicketComments`, `ActivityLog`
- An SNS topic `HelpdeskAlerts` with an email subscription (confirm the subscription email AWS sends you)

`terraform output` gives you `app_server_public_ip`, `api_base_url`, `rds_endpoint`, and `sns_topic_arn`.

> The EC2 user-data script (`backend/deploy/ec2-user-data.sh.tpl`) expects the `backend/`
> folder to be present at `/opt/helpdesk-portal` on the instance — wire this to your CI/CD
> (`git clone`, or upload a zip via S3) before `terraform apply`, or `scp` it manually and
> re-run `sudo systemctl restart helpdesk`.

## 2. Run the backend locally (for development)

```bash
cd backend
cp .env.example .env      # fill in your RDS endpoint, SNS topic ARN, etc.
npm install
npm run migrate           # creates users/projects/tickets tables in RDS
npm run dev                # starts on http://localhost:3000
```

## 3. Try it

Open `frontend/index.html` directly in a browser (or serve it), point "API Base URL" at
your EC2 public IP or `localhost:3000/api`, then:
1. Register a user → Login (copies the JWT into the page)
2. Create a ticket — publishes to SNS if priority is High/Critical
3. List tickets, add a comment (stored in DynamoDB)

Or with curl:
```bash
curl -X POST $API/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Surya","email":"surya@test.com","password":"pass1234"}'

curl -X POST $API/auth/login -H "Content-Type: application/json" \
  -d '{"email":"surya@test.com","password":"pass1234"}'
# -> use the returned token as: -H "Authorization: Bearer <token>"
```

## 4. Promote a user to agent/admin

Self-registration only creates `role = user`. Promote someone directly in RDS:
```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

## 5. How the pieces map to the ticket lifecycle

| Action | AWS service touched |
|---|---|
| Create ticket | RDS (insert) → DynamoDB ActivityLog → SNS publish (always; escalation subject if High/Critical) |
| Update status/priority (agent/admin only) | RDS (update) → DynamoDB ActivityLog → SNS publish if priority just became High/Critical |
| Add comment | DynamoDB TicketComments → DynamoDB ActivityLog |
| List tickets | RDS, filtered by role (own tickets / assigned tickets / all tickets) |

## 6. Cost note

`t2.micro` + `db.t3.micro` + on-demand DynamoDB + SNS are all within/near the AWS Free
Tier for a student project. Run `terraform destroy` when you're done demoing to avoid
ongoing RDS charges.
