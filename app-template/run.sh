#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to cleanup background processes
cleanup() {
    print_status "Shutting down services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$CADDY_PID" ]; then
        kill $CADDY_PID 2>/dev/null || true
    fi
    exit 0
}

# Set trap to cleanup on exit
trap cleanup EXIT INT TERM

# Check if setup has been run
check_setup() {
    if [ ! -f "backend/.env" ]; then
        print_error "Backend .env file not found. Please run ./setup.sh first"
        exit 1
    fi
    
    if [ ! -d "node_modules" ]; then
        print_error "Dependencies not installed. Please run ./setup.sh first"
        exit 1
    fi
}

# Start backend
start_backend() {
    print_status "Starting backend server..."
    cd backend
    pnpm dev &
    BACKEND_PID=$!
    cd ..
    print_success "Backend started (PID: $BACKEND_PID)"
}

# Start frontend
start_frontend() {
    print_status "Starting frontend server..."
    cd frontend
    pnpm dev &
    FRONTEND_PID=$!
    cd ..
    print_success "Frontend started (PID: $FRONTEND_PID)"
}

# Start Caddy proxy
start_caddy() {
    if command_exists caddy; then
        print_status "Starting Caddy reverse proxy..."
        cd e2b
        caddy run --config Caddyfile &
        CADDY_PID=$!
        cd ..
        print_success "Caddy started (PID: $CADDY_PID)"
        return 0
    else
        print_error "Caddy not found. Install Caddy to use localhost:8080"
        print_error "Install: https://caddyserver.com/docs/install"
        return 1
    fi
}

# Wait for services to be ready
wait_for_services() {
    local use_caddy=$1
    print_status "Waiting for services to start..."
    sleep 3
    
    # Check if backend is responding
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        print_success "Backend is ready at http://localhost:3001"
    else
        print_status "Backend starting up... (may take a moment)"
    fi
    
    print_success "Frontend should be ready at http://localhost:5173"
    
    if [ "$use_caddy" = "true" ]; then
        sleep 2
        if curl -s http://localhost:8080 > /dev/null 2>&1; then
            print_success "Caddy proxy is ready at http://localhost:8080"
        else
            print_status "Caddy starting up... (may take a moment)"
        fi
    fi
}

# Display status
show_status() {
    local use_caddy=$1
    echo
    print_success "🚀 Application is running!"
    echo
    print_status "Services:"
    if [ "$use_caddy" = "true" ]; then
        print_status "  🌐 Application: http://localhost:8080 (via Caddy)"
        print_status "  📱 Frontend:    http://localhost:5173 (direct)"
        print_status "  ⚙️  Backend:     http://localhost:3001 (direct)"
    else
        print_status "  📱 Frontend: http://localhost:5173"
        print_status "  ⚙️  Backend:  http://localhost:3001"
    fi
    echo
    print_status "Logs will appear below. Press Ctrl+C to stop all services."
    echo
}

# Main function
main() {
    local use_caddy=${USE_CADDY:-true}
    
    print_status "Starting application..."
    
    check_setup
    
    start_backend
    sleep 2
    
    start_frontend
    
    if [ "$use_caddy" = "true" ]; then
        sleep 1
        if start_caddy; then
            wait_for_services true
            show_status true
        else
            print_status "Continuing without Caddy..."
            wait_for_services false
            show_status false
        fi
    else
        wait_for_services false
        show_status false
    fi
    
    # Wait for user to stop
    wait
}

# Parse command line arguments
case "${1:-}" in
    --backend-only)
        print_status "Starting backend only..."
        check_setup
        cd backend
        pnpm dev
        ;;
    --frontend-only)
        print_status "Starting frontend only..."
        check_setup
        cd frontend
        pnpm dev
        ;;
    --no-caddy)
        print_status "Starting without Caddy proxy..."
        USE_CADDY=false main "$@"
        ;;
    --caddy-only)
        print_status "Starting Caddy proxy only..."
        if command_exists caddy; then
            cd e2b
            caddy run --config Caddyfile
        else
            print_error "Caddy not found. Install Caddy first."
            exit 1
        fi
        ;;
    --help|-h)
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --backend-only   Start only the backend server"
        echo "  --frontend-only  Start only the frontend server"
        echo "  --no-caddy       Start without Caddy reverse proxy"
        echo "  --caddy-only     Start only the Caddy reverse proxy"
        echo "  --help, -h       Show this help message"
        echo ""
        echo "Default: Start backend, frontend, and Caddy proxy"
        echo "         Access your app at http://localhost:8080"
        ;;
    *)
        main "$@"
        ;;
esac
