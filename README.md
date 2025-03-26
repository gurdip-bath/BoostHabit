BoostHabit

BoostHabit is a gamified habit tracking application designed to help users build and maintain positive habits through engaging game mechanics like experience points, levels, streaks, and achievements.

Features

- User Authentication: Secure login and registration with JWT tokens
- Habit Management: Create, track, and delete personal habits
- Gamification Elements:
  - Experience points and leveling system
  - Streak tracking (current and longest)
  - Achievement badges for milestones
  - Visual progress indicators
- Interactive Dashboard: View statistics and overall progress

Tech Stack

Frontend
- React
- React Router for navigation
- Custom CSS with component-based architecture

Backend
- Node.js
- Express.js
- PostgreSQL database
- JSON Web Tokens (JWT) for authentication
- bcrypt.js for password hashing
- Express Validator for input validation

Project Structure

Key components in the application:

- Authentication (Login.js, Register.js)
- Dashboard (dashboard.js, StatsOverview.js)
- Habit tracking (HabitCard.js, HabitForm.js, HabitLevel.js)
- Achievements (Achievements.js)
- Notifications (Notification.js)

API Endpoints

Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token

Habits
- `GET /api/habits` - Get all habits
- `GET /api/habits/:id` - Get a specific habit
- `POST /api/habits` - Create a new habit
- `PUT /api/habits/:id` - Update a habit
- `DELETE /api/habits/:id` - Delete a habit
- `PATCH /api/habits/:id/complete` - Mark a habit as completed

Habit Progress
- `GET /api/habitprogress/:habit_id` - Get progress for a specific habit
- `POST /api/habitprogress` - Create a progress entry
- `PUT /api/habitprogress/:habit_id` - Update a progress entry
- `DELETE /api/habitprogress/:habit_id` - Delete a progress entry
