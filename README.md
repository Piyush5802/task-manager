# Task Management System (Node.js + MySQL)

This is a backend system for managing user tasks with authentication, email reminders, recurring scheduling, and status history tracking — all built using Node.js, Express, MySQL (Raw SQL), JWT, SendGrid, and Cron Jobs.


# Features
 - User Registration & Login (JWT Auth)

 - Create, View, Complete Tasks

 - Daily / Weekly / Monthly Recurring Tasks

 - Email Notifications 1 Hour Before Due Time

 - Task Status History Tracking

 - Cron Job-Based Notification System

 - MySQL with Raw SQL Queries (No ORM)

 - Email via SendGrid


# Tech Stack
Node.js, Express.js

MySQL (Raw SQL via mysql2)

JWT Authentication

SendGrid for email notifications

node-cron for task scheduling


**Getting Started**

# Clone the Repo & Install Dependencies

 - git clone https://github.com/your-username/task-manager.git
 - cd task-manager
 - npm install
# Setup Environment Variables

Create a .env file in the root:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=task_manager
JWT_SECRET=supersecretjwt
JWT_TOKEN_EXPIRY=1d
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_EMAIL_FROM=your_verified_sendgrid_email@example.com

# Setup MySQL Database

Login to MySQL and run the schema:

CREATE DATABASE task_manager;
USE task_manager;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  description TEXT,
  due_date DATETIME,
  priority VARCHAR(50),
  status ENUM('pending', 'completed'),
  recurrence ENUM('none', 'daily', 'weekly', 'monthly') DEFAULT 'none',
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE task_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT,
  status VARCHAR(50),
  changed_at DATETIME,
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT,
  sent_at DATETIME,
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);


# Start the Server

npm start
The server will start on http://localhost:5000

 API Endpoints
 Authentication
Method	Endpoint	        Description
POST	/api/auth/register	Register user
POST	/api/auth/login	    Login user and get JWT

Task Management (Protected Routes)
Use JWT in header: Authorization: Bearer <token>

Method	Endpoint	            Description
POST	/api/tasks	            Create a task
GET	    /api/tasks	            Get all user tasks
PUT	    /api/tasks/:id/complete	Mark task as completed

Recurring Task Logic
If a task has recurrence (daily, weekly, monthly) and is marked as completed, the next occurrence is auto-created with updated due_date.

# Cron Job for Email Notifications
Runs every 5 minutes

Checks for tasks due in the next 60 minutes

Sends reminder emails via SendGrid

# Sample Task JSON

{
  "title": "Finish Assignment",
  "description": "Backend task manager project",
  "due_date": "2025-06-05T17:00:00",
  "priority": "high",
  "recurrence": "daily"
}

# SendGrid Email Setup
Create a SendGrid account

Generate API Key

Verify sender email

Add credentials in .env