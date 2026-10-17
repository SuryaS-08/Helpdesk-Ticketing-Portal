 Helpdesk Ticketing Portal on AWS

Project Team: Surya S (44111021), Marx O S (44110977), Mohamad Farhan (44110978)

 Abstract

This project focuses on building a Helpdesk Ticketing Portal on AWS. It lets users raise and track support tickets while administrators and agents update status and priority. The application is hosted on Amazon EC2, ticket data is stored in Amazon RDS, comments and activity logs are stored in Amazon DynamoDB, and Amazon SNS sends alerts for new and high-priority tickets. Role-based views control what each user can see, and secure authentication protects access. This improves support response time and makes ticket management easier and more organized.

**Keywords:** AWS EC2, Amazon RDS, DynamoDB, Amazon SNS, Ticket Lifecycle, Role-Based Access, Notifications.

 Objectives

- To create a portal for raising and tracking support tickets.
- To implement the ticket lifecycle with priority levels.
- To store ticket data in RDS and comments/logs in DynamoDB.
- To add comments and an activity log for every ticket.
- To provide role-based views for User, Agent, and Admin.
- To trigger SNS alerts for new and high-priority tickets.

 Roles and Access

| Role | Dashboard | Permission |
| --- | --- | --- |
| User | My Tickets | Create tickets, view own tickets, add comments |
| Agent | Assigned Tickets | Update status and priority, comment on assigned tickets |
| Admin | All Tickets | View all tickets, assign agents, manage users |

 Technologies Used

- Amazon Web Services (AWS)
- Amazon EC2
- Amazon RDS (PostgreSQL)
- Amazon DynamoDB
- Amazon SNS
- AWS IAM
- Node.js / Express, JWT authentication

 Key Concepts

Ticket Lifecycle: A ticket moves through New, Assigned, In Progress, On Hold, Resolved, Closed, and Reopened.

Priority: Tickets are marked Low, Medium, High, or Critical to decide how urgently they are handled.

Comments and Activity Log: Every comment and status change is stored in DynamoDB for a full audit trail.

Role-Based Views: Users, agents, and admins see only the tickets and actions meant for their role.

SNS Notifications: New and High/Critical tickets publish an alert that reaches admins and agents by email or SMS.

 Implementation

1. Created the AWS infrastructure: EC2 instance, RDS database, DynamoDB tables, and SNS topic.
2. Created an IAM role so EC2 can access DynamoDB and SNS without stored keys.
3. Designed the RDS tables for users, tickets, and projects.
4. Built the backend API for registration, login, and ticket management.
5. Added role-based access so each role sees only its own data.
6. Stored comments and activity logs in DynamoDB.
7. Configured SNS to publish alerts for new and high-priority tickets.
8. Tested ticket creation, updates, comments, and notifications for each role.

 Expected Result

The project successfully demonstrates a working cloud-based helpdesk system.

- Users can raise tickets and track their status.
- Agents and admins can update status and priority.
- Comments and changes are recorded in DynamoDB.
- High-priority and new tickets trigger SNS alerts immediately.
- Role-based views keep each user's data separate and controlled.

 Conclusion

This project demonstrates how AWS services can be combined to build a complete ticketing system. EC2 hosts the application, RDS and DynamoDB store the data, and SNS delivers real-time alerts. Role-based access and a full ticket lifecycle improve security, response time, and support management.

Project: Helpdesk Ticketing Portal

**Platform:** Amazon Web Services (AWS)
