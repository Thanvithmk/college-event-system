# Secure College Event Registration System

A full-stack management system built using the MERN-lite stack (Express, MongoDB, Node.js) with JWT Authentication and Docker Containerization.

## 🚀 Overview
This project is designed to manage college events efficiently. It allows users to register, login securely via JWT, create events, and manage registrations. A key security feature is "Creator-Only Deletion," ensuring that only the user who posted an event can remove it.

## ✨ Key Features
- **Secure Authentication:** User registration and login using JSON Web Tokens (JWT).
- **Event Management:** CRUD operations for events (Create, Read, Delete).
- **Authorization:** Only the event creator can delete their specific events.
- **Event Joining:** Students can register for events by providing their names.
- **Containerized:** Fully managed via Docker and Docker Compose for easy deployment.

## 🛠 Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Running in Docker)
- **Authentication:** JWT (JSON Web Token)
- **Frontend:** Vanilla HTML5, CSS3, JavaScript
- **DevOps:** Docker, Docker Compose

## 📋 Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your machine.

## ⚙️ Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/college-event-system.git
   cd college-event-system


## Start the application using Docker Compose:

docker-compose up --build


## Access the application:

Open your browser and go to: http://localhost:3000

# 🔌 API Endpoints

Method	Endpoint	Description	Auth Required
POST	/register-user	Register a new user	No
POST	/login	Login and receive JWT	No
GET	/events	View all events	No
POST	/events	Create a new event	Yes (JWT)
DELETE	/events/:id	Delete an event	Yes (Creator Only)
POST	/join	Register a student for an event	No

## 📦 Project Structure

├── server.js           # Express server & API logic
├── public/             # Frontend files
│   ├── index.html      # Main Dashboard UI
│   └── script.js       # Frontend logic & API calls
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Multi-container orchestration
└── package.json        # Dependencies

