-- Helpdesk Ticketing Portal - initial RDS (PostgreSQL) schema

CREATE TYPE user_role AS ENUM ('user', 'agent', 'admin');
CREATE TYPE ticket_status AS ENUM ('New', 'Assigned', 'In Progress', 'On Hold', 'Resolved', 'Closed', 'Reopened');
CREATE TYPE ticket_priority AS ENUM ('Low', 'Medium', 'High', 'Critical');

CREATE TABLE users (
    user_id       SERIAL PRIMARY KEY,
    name          VARCHAR(120) NOT NULL,
    email         VARCHAR(160) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role          user_role NOT NULL DEFAULT 'user',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE projects (
    project_id   SERIAL PRIMARY KEY,
    name         VARCHAR(160) NOT NULL,
    description  TEXT
);

CREATE TABLE tickets (
    ticket_id    SERIAL PRIMARY KEY,
    title        VARCHAR(200) NOT NULL,
    description  TEXT NOT NULL,
    status       ticket_status NOT NULL DEFAULT 'New',
    priority     ticket_priority NOT NULL DEFAULT 'Medium',
    project_id   INTEGER REFERENCES projects(project_id),
    created_by   INTEGER NOT NULL REFERENCES users(user_id),
    assigned_to  INTEGER REFERENCES users(user_id),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tickets_created_by ON tickets(created_by);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_status ON tickets(status);

-- Seed project matching the form's "Helpdesk Ticketing Portal" example
INSERT INTO projects (name, description) VALUES
('Helpdesk Ticketing Portal', 'Raise/track support tickets with admin updates; hosted on EC2, tickets in RDS/DynamoDB, alerts via SNS.');
