# Workasana

A modern, full-stack project and task management application inspired by Asana. Workasana helps teams organize, track, and manage their work efficiently with an intuitive interface and powerful analytics.

![Dashboard Preview](frontend/src/assets/dashboard-preview.png)

## Features

### Core Features

- **User Authentication & Security**
  - Secure signup and login with JWT-based authentication
  - HTTP-only cookies for token storage
  - Protected routes and middleware authorization
  - Password hashing with bcrypt

- **Project Management**
  - Create and view projects with descriptions
  - Project-specific task listings
  - Clean, card-based interface

- **Task Management**
  - Create tasks with multiple owners
  - Set time estimates and track completion
  - Four status types: To Do, In Progress, Completed, Blocked
  - Update task status with visual feedback
  - Task tagging system for organization
  - Filter tasks by team, owner, project, status, and tags
  - Individual task detail pages

- **Team Collaboration**
  - Create and manage teams
  - Add members to teams
  - Assign multiple owners to tasks
  - Team-specific task views
  - Team detail pages with member lists

- **Reports & Analytics**
  - Last week completed tasks with daily breakdown
  - Pending work analysis grouped by status
  - Closed tasks statistics by team, owner, and project
  - Visual charts using Chart.js (bar, pie, doughnut)
  - Four dedicated report visualizations

- **User Experience**
  - Responsive dashboard with overview of projects and tasks
  - Real-time toast notifications for user actions
  - Consistent card heights and clean UI
  - Avatar displays with initials for task owners
  - Sidebar navigation
  - Settings page for user preferences

## Tech Stack

### Frontend

- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **TanStack React Query** - Data fetching and state management
- **Chart.js** + react-chartjs-2 - Data visualization
- **Axios** - HTTP client
- **React Hot Toast** - Notification system
- **Radix UI** - Accessible component primitives (avatars, dialogs, labels)
- **Lucide React** - Icon library

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **cookie-parser** - Cookie handling
- **cors** - Cross-origin resource sharing
- **Nodemon** - Development auto-reload

## Project Structure

```
workasana/
├── backend/                    # Express.js + MongoDB API
│   ├── controllers/            # Business logic handlers
│   │   ├── auth.controllers.js
│   │   ├── project.controllers.js
│   │   ├── report.controllers.js
│   │   ├── tag.controllers.js
│   │   ├── task.controllers.js
│   │   ├── team.controllers.js
│   │   └── user.controllers.js
│   ├── models/                 # Mongoose schemas
│   │   ├── project.models.js
│   │   ├── tag.models.js
│   │   ├── task.models.js
│   │   ├── team.models.js
│   │   └── user.models.js
│   ├── routes/                 # API endpoints
│   │   ├── auth.routes.js
│   │   ├── project.routes.js
│   │   ├── report.routes.js
│   │   ├── tag.routes.js
│   │   ├── task.routes.js
│   │   ├── team.routes.js
│   │   └── user.routes.js
│   ├── middlewares/            # Authentication middleware
│   │   └── verifyJWT.js
│   ├── utils/                  # Utility functions
│   │   ├── asyncHandler.js
│   │   └── auth.utils.js
│   ├── db/                     # Database connection
│   │   └── connect.js
│   ├── index.js                # Express server setup
│   └── package.json
│
├── frontend/                   # React + TypeScript app
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # Login, Signup, ProtectedRoute
│   │   │   ├── dashboard/      # Dashboard components & modals
│   │   │   ├── layout/         # DashboardLayout, Sidebar
│   │   │   ├── projects/       # Project pages & components
│   │   │   ├── reports/        # Reports page
│   │   │   ├── tasks/          # Task pages & components
│   │   │   ├── team/           # Team pages & components
│   │   │   └── ui/             # Reusable UI components (shadcn-style)
│   │   ├── api/                # Axios API clients
│   │   ├── hooks/              # React Query custom hooks
│   │   ├── types/              # TypeScript interfaces
│   │   ├── lib/                # Utility libraries
│   │   ├── queries/            # Query configuration
│   │   └── App.tsx             # Main app with routing
│   ├── package.json
│   └── vite.config.ts
│
├── docs/                       # Documentation
└── README.md
```

## API Endpoints

### Authentication (`/api/v1/auth`)

- `POST /signup` - User registration
- `POST /login` - User login (returns JWT in HTTP-only cookie)
- `GET /me` - Get current authenticated user
- `POST /logout` - Logout and clear authentication cookie

### Tasks (`/api/v1/tasks`)

- `GET /` - Get all tasks (supports query filters: team, owner, project, status, tags)
- `GET /:id` - Get task by ID
- `GET /project/:projectId` - Get tasks for a project
- `GET /team/:teamId` - Get tasks for a team
- `POST /` - Create new task
- `PATCH /:id/status` - Update task status

### Projects (`/api/v1/projects`)

- `GET /` - Get all projects
- `GET /:id` - Get project by ID
- `POST /` - Create new project

### Teams (`/api/v1/teams`)

- `GET /` - Get all teams
- `GET /:teamId` - Get team by ID
- `POST /` - Create new team
- `POST /:teamId/members` - Add member to team

### Users (`/api/v1/users`)

- `GET /` - Get all users

### Tags (`/api/v1/tags`)

- `GET /` - Get all tags
- `POST /` - Create new tag

### Reports (`/api/v1/report`)

- `GET /last-week` - Get last week completed tasks with daily breakdown
- `GET /pending` - Get pending work analysis
- `GET /closed-tasks` - Get closed tasks statistics

## Scripts

### Frontend

```bash
npm run dev      # Start Vite development server
npm run build    # TypeScript compile + Vite production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend

```bash
npm run dev      # Start with nodemon
```

## Setup / Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd workasana
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   ```

3. **Configure Backend Environment Variables**

   Create a `.env` file in the `backend` directory:

   ```env
   # Server Configuration
   PORT=3000

   # Database
   MONGO_URI=<your-mongodb-connection-string>
   # Example: mongodb+srv://username:password@cluster.mongodb.net/workasana

   # JWT Secret (use a strong random string)
   SECRET_KEY=<your-jwt-secret-key>

   # CORS (frontend URL)
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Frontend Setup**

   ```bash
   cd ../frontend
   npm install
   ```

5. **Configure Frontend Environment Variables**

   Create a `.env` file in the `frontend` directory:

   ```env
   # Backend API URL
   VITE_BASE_API_URL=http://localhost:3000/api/v1
   ```

6. **Start the Application**

   Open two separate terminal windows:

   **Terminal 1 - Backend:**

   ```bash
   cd backend
   npm run dev
   ```

   The backend server will start on `http://localhost:3000`

   **Terminal 2 - Frontend:**

   ```bash
   cd frontend
   npm run dev
   ```

   The frontend development server will start on `http://localhost:5173`

7. **Access the Application**

   Open your browser and navigate to `http://localhost:5173`

8. **Create Your Account**
   - Sign up with your name, email, username, and password
   - Login to access the dashboard
   - Start creating teams, projects, and tasks

## Key Features Implementation

### Authentication Flow

- JWT tokens stored in HTTP-only cookies for security
- Password hashing with bcrypt (12 salt rounds)
- 1-day token expiry
- Protected routes using middleware verification

### Task Filtering

Advanced filtering supports multiple parameters:

- Filter by team, owner, project
- Filter by status (To Do, In Progress, Completed, Blocked)
- Filter by tags
- Combine multiple filters for precise results

### Reports & Analytics

Four comprehensive report types:

1. **Last Week Completed**: Daily breakdown of completed tasks
2. **Pending Work**: Tasks grouped by current status
3. **Closed Tasks by Team**: Completion metrics per team
4. **Closed Tasks by Owner/Project**: Individual and project-level statistics

All reports visualized with Chart.js for clear insights.

## Development Notes

- Frontend uses React Query for efficient data fetching and caching (5-minute stale time)
- API responses are automatically cached and invalidated on mutations
- UI components follow shadcn/ui patterns for consistency
- Responsive design with TailwindCSS
- TypeScript provides type safety across the frontend
- Modular API client structure for maintainability

## License

This project is open source and available under the MIT License.

## Connect

- **Website**: [manavsingh.in](https://manavsingh.in)
- **LinkedIn**: [manvendras1ngh](https://linkedin.com/in/manvendras1ngh)
- **Email**: connect@manavsingh.in

---
