# 🚀 NextStep - ICT Career Pathway Discovery Platform

http://nextstep-frontend-tharindu.s3-website-us-east-1.amazonaws.com/

<div align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/.NET-9.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
</div>

<div align="center">
  <h3>🎯 Empowering students to discover their perfect ICT career path</h3>
  <p>A modern full-stack application connecting students with industry experts for career guidance and skill development</p>
</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔧 Development Setup](#-development-setup)
- [📚 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

### For Students
- 🎓 **Smart Career Assessment** - AI-powered career path recommendations
- 📊 **Skill Tracking** - Monitor your learning progress and achievements
- 🏆 **Gamification** - Earn points, level up, and compete on leaderboards
- 💼 **Industry Connections** - Connect with real industry professionals
- 📚 **Curated Learning** - Access to relevant courses and resources

### For Industry Experts
- 👥 **Student Discovery** - Find and mentor promising students
- 🎯 **Talent Pipeline** - Build relationships with future employees
- 📈 **Impact Tracking** - See your influence on student career paths
- 🌟 **Professional Branding** - Showcase your expertise and company

### Platform Features
- 🔐 **Secure Authentication** - JWT-based user authentication
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Fast Performance** - Optimized with modern web technologies
- 🔄 **Real-time Updates** - Live data synchronization
- 📖 **API Documentation** - Comprehensive Swagger documentation

## 🏗️ Tech Stack

### Backend
- **Framework**: ASP.NET Core 9.0
- **Database**: SQLite with Entity Framework Core
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI
- **Architecture**: Clean Architecture with Dependency Injection

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (Lightning fast HMR)
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context + TanStack Query
- **Routing**: React Router v6
- **HTTP Client**: Native Fetch API

### Development Tools
- **Package Manager**: npm
- **Code Quality**: ESLint + Prettier
- **Version Control**: Git with conventional commits
- **API Testing**: Swagger UI + REST Client

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **.NET SDK** (v9.0 or higher) - [Download here](https://dotnet.microsoft.com/download)
- **Git** - [Download here](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/Team-BISHOP/nextstep.git
cd nextstep
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Restore dependencies
dotnet restore

# Start the backend server
dotnet run
```

**Backend will be available at:**
- API: `https://localhost:7010`
- Swagger Docs: `https://localhost:7010/swagger`

### 3. Frontend Setup
```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

**Frontend will be available at:**
- App: `http://localhost:8080`

### 4. Test the Connection
1. Visit `http://localhost:8080/auth`
2. Create a new account (Student or Industry Expert)
3. Login with your credentials
4. Explore the platform!

### 5. Deployment Overview
#### 💠 What Each Environment Uses:

| **Environment**     | **Web Server**         | **Config File**                | **Status**     |
|---------------------|------------------------|--------------------------------|----------------|
| S3 Deployment       | AWS S3 Static Hosting  | `S3 website config`            | ✅ Working     |
| Docker Compose      | nginx                  | 🟩 `nginx.conf`                 | ✅ Now Fixed   |
| Local Dev           | Vite dev server        | ⚡ `vite.config.ts`             | ✅ Working     |



## 🔧 Development Setup

### Environment Variables

#### Backend (`backend/appsettings.Development.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=nextstep_dev.db"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-at-least-32-characters",
    "Issuer": "NextStepAPI",
    "Audience": "NextStepClient",
    "ExpiryInHours": 24
  }
}
```

#### Frontend (`frontend/.env`)
```env
VITE_API_URL=https://localhost:7010/api
```

### Development Commands

#### Backend
```bash
# Restore dependencies
dotnet restore

# Run in development mode
dotnet run

# Run with hot reload
dotnet watch run

# Install CLI tool for Entity Framework Core
dotnet tool install --global dotnet-ef

# Create new migration
dotnet ef migrations add MigrationName --output-dir Data/Migrations

# Update database
dotnet ef database update

# Run tests
dotnet test
```

#### Frontend
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📚 API Documentation

### 🛡️ Authentication Endpoints

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/Auth/register` | Create new user account |
| POST   | `/api/Auth/login`    | Authenticate user       |

---

### 📘 Course Endpoints

| Method | Endpoint                           | Description                 |
| ------ | ---------------------------------- | --------------------------- |
| GET    | `/api/Courses`                     | Get all courses             |
| GET    | `/api/Courses/{courseId}`          | Get course by ID            |
| POST   | `/api/Courses/{courseId}/enroll`   | Enroll in a course          |
| PUT    | `/api/Courses/{courseId}/progress` | Update progress in a course |
| POST   | `/api/Courses/{courseId}/complete` | Mark course as complete     |

---

### 🏆 Leaderboard Endpoints

| Method | Endpoint                   | Description               |
| ------ | -------------------------- | ------------------------- |
| GET    | `/api/Leaderboard`         | Get global leaderboard    |
| GET    | `/api/Leaderboard/my-rank` | Get logged-in user's rank |

---

### 🙍‍♂️ Profile Endpoints

| Method | Endpoint                        | Description                  |
| ------ | ------------------------------- | ---------------------------- |
| GET    | `/api/Profiles/me`              | Get your profile             |
| PUT    | `/api/Profiles/me`              | Update your profile          |
| GET    | `/api/Profiles/{userId}/public` | Get public profile of a user |
| GET    | `/api/Profiles/students`        | Get list of student profiles |

---

### 📂 Project Endpoints

| Method | Endpoint                    | Description          |
| ------ | --------------------------- | -------------------- |
| GET    | `/api/Projects`             | Get all projects     |
| POST   | `/api/Projects`             | Create new project   |
| GET    | `/api/Projects/{projectId}` | Get project by ID    |
| PUT    | `/api/Projects/{projectId}` | Update project by ID |
| DELETE | `/api/Projects/{projectId}` | Delete project by ID |

---

### 📨 Subscription Endpoints

| Method | Endpoint                        | Description                |
| ------ | ------------------------------- | -------------------------- |
| POST   | `/api/Subscription/subscribe`   | Subscribe to a service     |
| POST   | `/api/Subscription/unsubscribe` | Unsubscribe from a service |

---

### Interactive Documentation
Visit [`https://localhost:7010/swagger`](https://localhost:7010/swagger) while the backend is running to explore the full Swagger-based API documentation.

## 🤝 Contributing

We welcome contributions from the community!

### Code Style
- **Backend**: Follow C# coding conventions
- **Frontend**: ESLint + Prettier configurations included
- **Database**: Use Entity Framework migrations for schema changes

## 🐛 Troubleshooting

### Common Issues

#### CORS Errors
```
Access to fetch has been blocked by CORS policy
```
**Solution**: Ensure backend is running and CORS is configured for your frontend URL.

#### Database Not Found
```
SQLite Error 1: 'no such table: Users'
```
**Solution**: Run `dotnet ef database update` in the backend directory.

#### Port Already in Use
```
Failed to bind to address https://localhost:7010
```
**Solution**: Kill the process using the port or change the port in `launchSettings.json`.

## 🎯 Roadmap

### Phase 1 (Current) ✅
- [x] User authentication system
- [x] Basic frontend structure
- [x] API documentation

### Phase 2 (In Progress) 🚧
- [ ] User profile management
- [ ] Career assessment quiz
- [ ] Student-expert matching

### Phase 3 (Planned) 📋
- [ ] Learning path recommendations
- [ ] Progress tracking
- [ ] Gamification system
- [ ] Real-time chat
- [ ] Mobile app

## 📄 License

This project is licensed under the Apache License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- **shadcn/ui** - Beautiful UI components
- **Tailwind CSS** - Utility-first CSS framework
- **ASP.NET Core** - High-performance web framework
- **React** - A JavaScript library for building user interfaces

---

<div align="center">
  <p>Made with ❤️ by the NextStep Team</p>
  <p>⭐ Star us on GitHub if this project helped you!</p>
</div>

## 📞 Contact

- **Issues**: [https://github.com/Team-BISHOP/nextstep/issues](https://github.com/Team-BISHOP/nextstep/issues)

---

