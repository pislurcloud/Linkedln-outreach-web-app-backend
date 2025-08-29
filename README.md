# LinkedIn Outreach Pro - Backend API

Backend API for LinkedIn Outreach Pro application.

## Setup Instructions

1. Fork this repository
2. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL commands below to create tables
   - Copy your project URL and anon key

3. Set up environment variables in Render:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - JWT_SECRET
   - FRONTEND_URL

4. Deploy to Render:
   - Connect your GitHub repository
   - Choose "Web Service"
   - Build command: `npm install`
   - Start command: `npm start`

## API Endpoints

- POST /api/auth/register
- POST /api/auth/login
- GET /api/jobs
- GET /api/jobs/:id
- POST /api/jobs/:id/apply
- GET /api/connections
- POST /api/connections
- GET /api/resume
- PUT /api/resume
- GET /api/analytics/dashboard

## Database Schema

See database-schema.sql for Supabase table creation commands.
