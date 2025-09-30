# Running the Application

This guide shows you how to run your full-stack TypeScript application.

## 🚀 Quick Start

### With Caddy (Recommended)

```bash
# Install Caddy (if not already installed)
# macOS:
brew install caddy

# Run the app
./run.sh
```

**Access your app at: http://localhost:8080** 🌐

### Without Caddy

```bash
./run.sh --no-caddy
```

**Access frontend at: http://localhost:5173** 📱

## 📋 Prerequisites

- Node.js >= 22.17.1
- pnpm ~10.14.0
- PostgreSQL database
- Caddy (optional, for localhost:8080 access)

## ⚙️ Setup (First Time)

### Option 1: Quick Setup with Docker

```bash
./quick-start.sh # Sets up PostgreSQL with Docker + runs setup
./run.sh         # Start the application
```

### Option 2: Manual Setup

```bash
./setup.sh # Install deps, setup DB, configure environment
./run.sh   # Start the application
```

## 🎛️ Run Options

| Command                    | Description                   | URLs                                                                                            |
| -------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------- |
| `./run.sh`                 | Start all services with Caddy | App: http://localhost:8080<br>Frontend: http://localhost:5173<br>Backend: http://localhost:3001 |
| `./run.sh --no-caddy`      | Start without reverse proxy   | Frontend: http://localhost:5173<br>Backend: http://localhost:3001                               |
| `./run.sh --backend-only`  | Backend only                  | http://localhost:3001                                                                           |
| `./run.sh --frontend-only` | Frontend only                 | http://localhost:5173                                                                           |
| `./run.sh --caddy-only`    | Caddy proxy only              | http://localhost:8080                                                                           |

## 🔧 How It Works

### With Caddy (Default)

```
Your Browser → localhost:8080 (Caddy) → Routes traffic:
                                      ├─ /api/* → Backend (localhost:3001)
                                      └─ /* → Frontend (localhost:5173)
```

### Without Caddy

```
Your Browser → localhost:5173 (Frontend) → API calls to localhost:3001 (Backend)
```

## 🛑 Stopping Services

Press `Ctrl+C` in the terminal where you ran `./run.sh` to stop all services gracefully.

## 🔍 Troubleshooting

### Caddy Not Found

```bash
# macOS
brew install caddy

# Ubuntu/Debian
sudo apt install caddy

# Other platforms
# See: https://caddyserver.com/docs/install
```

### Database Connection Issues

1. Ensure PostgreSQL is running
2. Check `backend/.env` for correct database URL
3. Quick Docker setup: `docker run --name app-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=app_db -p 5432:5432 -d postgres:15`

### Port Already in Use

- Backend (3001): Check for other Node.js apps
- Frontend (5173): Check for other Vite dev servers
- Caddy (8080): Check for other web servers

Kill processes using ports:

```bash
lsof -ti:8080 | xargs kill # Kill process on port 8080
lsof -ti:3001 | xargs kill # Kill process on port 3001
lsof -ti:5173 | xargs kill # Kill process on port 5173
```

## 📁 Project Structure

```
app-template/
├── backend/        # Fastify API server (port 3001)
├── frontend/       # React/Vite app (port 5173)
├── openapi/         # Shared types and schemas
├── e2b/            # Caddy configuration
├── setup.sh        # First-time setup script
├── run.sh          # Main run script
└── quick-start.sh  # Docker-based quick setup
```

## 🎯 Development Workflow

1. **First time**: `./setup.sh`
2. **Daily development**: `./run.sh`
3. **Access app**: http://localhost:8080
4. **Make changes**: Files auto-reload in development
5. **Stop**: `Ctrl+C`

Happy coding! 🚀
