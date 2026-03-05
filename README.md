# Alumni Management System

A full-stack Alumni Networking Platform designed for educational
institutes to manage alumni records, enable networking, mentorship, and
institutional announcements.

This project follows a production-style architecture using Node.js,
Express, PostgreSQL, and React with role-based access control.


# Features

## Authentication

-   Secure login using JWT
-   Protected API routes
-   Role-based access (Admin / Alumni)

## Alumni Profiles

Each alumni can maintain a professional profile including: 
- Headline
- Current Company
- Role Title
- Industry
- Location
- Bio

## Education History

Alumni can add multiple education records: - Degree Type 
- Field of Study
- Institution
- Start Year
- End Year
- Description

## Professional Experience

Alumni can maintain career history: 
- Company
- Role Title
- Industry
- Start Year
- End Year
- Description

## Alumni Discovery

Users can explore alumni using filters: 
- Name
- Industry
- Field of Study
- Graduation Year Range

Results can also be filtered year-wise on the UI.

## Public Alumni Profiles

Each alumni has a public profile page displaying: 
- Personal headline 
- Professional experience
- Educational history

## Mentorship System

Alumni can: 
- Send mentorship requests
- Accept or reject requests 
- Track incoming and outgoing mentorship requests

## Announcements

Institution administrators can: 
- Create announcements
- Pin important announcements
- Update announcements
- Delete announcements

Announcements appear on alumni dashboards.

## Admin Panel

Administrators can: 
- Verify alumni registrations
- Manage announcements

------------------------------------------------------------------------

# Tech Stack

## Backend

-   Node.js
-   Express.js
-   PostgreSQL
-   JWT Authentication

## Frontend

-   React
-   React Router
-   Tailwind CSS
-   Vite

------------------------------------------------------------------------

# Project Architecture

<pre>
Frontend (React) 
REST API (Express) 
PostgreSQL Database

Backend structure:

backend/ 
  controllers/ 
  routes/ 
  middlewares/ 
  db.js 
  app.js

Frontend structure:

frontend/ 
  pages/ 
  components/ 
  api/ 
  App.jsx
</pre>
------------------------------------------------------------------------

# Database Schema (Simplified)

users\
alumni\
alumni_profile\
alumni_experience\
alumni_education\
mentorship_requests\
announcements

Relationship overview:

<pre>
alumni
    ├── alumni_profile 
    ├── alumni_experience 
    └── alumni_education 
</pre>

------------------------------------------------------------------------

# Installation

## Clone Repository

git clone https://github.com/viralbhoi/alumni-management-system.git

------------------------------------------------------------------------

# Backend Setup

cd backend\
npm install

Create .env

PORT=3000\
DATABASE_URL=your_postgres_connection\
JWT_SECRET=your_secret_key

Run server

npm run dev

Backend runs at:

http://localhost:3000

------------------------------------------------------------------------

# Frontend Setup

cd frontend\
npm install\
npm run dev

Frontend runs at:

http://localhost:5173

------------------------------------------------------------------------

# Security

-   JWT authentication
-   Protected API routes
-   Admin role middleware
-   Verified alumni access control
-   Parameterized SQL queries (prevents SQL injection)

------------------------------------------------------------------------

# Current Status

The system currently supports:

-   Authentication
-   Alumni profiles
-   Education & experience management
-   Mentorship requests
-   Alumni discovery
-   Admin verification
-   Announcement management

The project is in the final polishing phase before deployment.

------------------------------------------------------------------------

# Author

Viral Bhoi\
B.Tech Computer Science\
ICPC Regionalist
