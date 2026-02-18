Reasons Why

Reasons Why is a private web app designed for two people to share meaningful messages in real-time. It combines Next.js 14 with Supabase for real-time communication, wrapped in a warm, glassmorphism-inspired interface.

Key Features

Private messaging for exactly two users

Real-time updates using Supabase Realtime

Read receipts and animated notifications

Fully responsive design for desktop and mobile

Elegant glassmorphism UI with smooth animations

Tech Stack

Frontend: Next.js 14, TypeScript, Tailwind CSS

Backend: Supabase (Database, Auth, Realtime)

Design: Glassmorphism with cream, blush rose, and sage green accents

Setup & Deployment

Create a Supabase project and run supabase/schema.sql

Add two users via Supabase Auth

Set environment variables (SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY)

Run locally with npm run dev or deploy on Vercel

Security

Row Level Security ensures users only see their own messages

Users can only send messages as the sender and mark them read if they’re the receiver

Route protection and server-side validation enforce privacy