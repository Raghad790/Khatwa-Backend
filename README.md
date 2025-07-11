# 🎓 Khatwa Backend -Online Learning Management System

This is the backend for the **Online Learning Management System (LMS)** project. It provides the RESTful API, database models, and business logic that power the LMS.

## 🚀 Features

- 🔐 Google OAuth 2.0 Authentication
- 👥 Role-based access control (Student, Instructor, Admin)
- 📚 Course & Module Management (CRUD operations)
- 📌 Enrollment System
- ✅ Progress Tracking
- 📝 Interactive Quizzes & Assignments
- 📬 Notifications System
- 📊 Admin Analytics & Reports
- 📦 PostgreSQL database with Sequelize ORM
- 🔁 RESTful API built using Express.js

## 🧱 Tech Stack

- **Node.js** with **Express.js**
- **PostgreSQL** with **Sequelize**
- **OAuth 2.0** via Google
- **JWT** for session management
- **Helmet**, **CORS**, and **dotenv** for security and config

## 📁 Project Structure

/controllers
/models
/routes
/middleware
/utils
/config

## 🔌 API Endpoints

- `POST /auth/google` – Google OAuth login
- `GET /courses` – Browse available courses
- `POST /courses` – Create course (instructor only)
- `POST /enroll` – Enroll in a course
- `GET /progress/:userId` – Track student progress
- And more...

## 🗃️ Database Design (PostgreSQL ERD)

Key Tables:

- `Users` (id, name, email, role, etc.)
- `Courses`, `Modules`, `Lessons`
- `Enrollments`, `Progress`
- `Quizzes`, `Assignments`, `Submissions`
- `Notifications`, `Categories`

> See `docs/ERD.md` for the full entity-relationship diagram.

## ⚙️ Installation & Setup

1. Clone the repo
2. Run `npm install`
3. Set environment variables in `.env`
4. Run migrations: `npx sequelize db:migrate`
5. Start the server: `npm run dev`

## 🧪 Testing

- Postman collection available in `docs/Postman_Collection.json`
- Run tests: `npm test`
