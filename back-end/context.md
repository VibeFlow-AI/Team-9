# 📘 EduVibe Backend Context (Prisma-Powered)

## 🧩 Overview

EduVibe's backend is built using **Node.js + Express** with **Prisma ORM** for database management. It supports personalized learning workflows for both students and mentors, including onboarding, session booking, dashboards, and AI-powered recommendations.

---

## 🗺️ REST API Endpoints Overview

### Base URL:

```
/api/v1
```

## 🎓 Student Endpoints

| Method | Endpoint                  | Description                           |
| ------ | ------------------------- | ------------------------------------- |
| GET    | `/students/:id`           | Get student profile                   |
| POST   | `/students/onboard`       | Multi-part form onboarding            |
| PUT    | `/students/:id`           | Update profile                        |
| GET    | `/students/:id/sessions`  | List booked sessions                  |
| GET    | `/students/match-mentors` | Get AI-matched mentor recommendations |

---

## 🧑‍🏫 Mentor Endpoints

| Method | Endpoint                | Description                |
| ------ | ----------------------- | -------------------------- |
| GET    | `/mentors/:id`          | Get mentor profile         |
| POST   | `/mentors/onboard`      | Multi-part form onboarding |
| PUT    | `/mentors/:id`          | Update profile             |
| GET    | `/mentors/:id/sessions` | List booked sessions       |

---

## 📅 Session Booking Endpoints

| Method | Endpoint                | Description                |
| ------ | ----------------------- | -------------------------- |
| POST   | `/sessions/book`        | Book a mentor session      |
| GET    | `/sessions/:id`         | Get session details        |
| PUT    | `/sessions/:id/upload`  | Upload bank slip           |
| GET    | `/sessions/student/:id` | All sessions for a student |
| GET    | `/sessions/mentor/:id`  | All sessions for a mentor  |

---

## 📊 Dashboard Endpoints

| Method | Endpoint                 | Description                         |
| ------ | ------------------------ | ----------------------------------- |
| GET    | `/dashboard/student/:id` | Get student dashboard data          |
| GET    | `/dashboard/mentor/:id`  | Get mentor analytics + session data |