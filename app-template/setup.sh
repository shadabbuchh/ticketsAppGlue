#!/bin/bash
set -e

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

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js version
    if command_exists node; then
        NODE_VERSION=$(node --version | sed 's/v//')
        REQUIRED_NODE="22.17.1"
        if [[ "$(printf '%s\n' "$REQUIRED_NODE" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_NODE" ]]; then
            print_warning "Node.js version $NODE_VERSION found. Required: >= $REQUIRED_NODE"
        else
            print_success "Node.js version $NODE_VERSION ✓"
        fi
    else
        print_error "Node.js not found. Please install Node.js >= 22.17.1"
        exit 1
    fi
    
    # Check pnpm
    if command_exists pnpm; then
        PNPM_VERSION=$(pnpm --version)
        print_success "pnpm version $PNPM_VERSION ✓"
    else
        print_error "pnpm not found. Installing pnpm..."
        npm install -g pnpm@10.14.0
    fi
    
    # Check PostgreSQL
    if command_exists psql; then
        print_success "PostgreSQL client found ✓"
    else
        print_warning "PostgreSQL client not found. You'll need a PostgreSQL database."
        print_warning "Consider using Docker: docker run --name app-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=app_db -p 5432:5432 -d postgres:15"
    fi
    
    # Check Caddy (optional)
    if command_exists caddy; then
        print_success "Caddy found ✓ - You can access the app at localhost:8080"
    else
        print_warning "Caddy not found (optional). Install for localhost:8080 access:"
        print_warning "macOS: brew install caddy"
        print_warning "Other: https://caddyserver.com/docs/install"
    fi
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    if [ ! -f "backend/.env" ]; then
        print_status "Creating backend/.env file..."
        cat > backend/.env << EOF
# Database Configuration
APP_DATABASE_URL=postgresql://postgres:password@localhost:5432/app_db

# Environment
NODE_ENV=development
EOF
        print_success "Created backend/.env with default values"
        print_warning "Please update the APP_DATABASE_URL in backend/.env with your actual database credentials"
    else
        print_success "backend/.env already exists"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    pnpm install
    print_success "Dependencies installed"
}

# Setup database
setup_database() {
    print_status "Setting up database..."

    # Check if database is accessible
    if ! pnpm --filter @app/backend exec node -e "
        const { Client } = require('pg');
        require('dotenv/config');
        const client = new Client({ connectionString: process.env.APP_DATABASE_URL });
        client.connect().then(() => {
            console.log('Database connection successful');
            client.end();
        }).catch(err => {
            console.error('Database connection failed:', err.message);
            process.exit(1);
        });
    " 2>/dev/null; then
        print_error "Cannot connect to database. Please ensure:"
        print_error "1. PostgreSQL is running"
        print_error "2. Database exists"
        print_error "3. APP_DATABASE_URL in backend/.env is correct"
        print_error ""
        print_error "Quick setup with Docker:"
        print_error "docker run --name app-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=app_db -p 5432:5432 -d postgres:15"
        exit 1
    fi

    print_success "Database connection verified"

    # Drop existing tables and types to ensure clean state
    print_status "Cleaning up existing database objects..."
    cd backend
    pnpm exec node -e "
        const { Client } = require('pg');
        require('dotenv/config');

        async function cleanDatabase() {
            const client = new Client({ connectionString: process.env.APP_DATABASE_URL });
            try {
                await client.connect();

                // Get all user tables (excluding system tables)
                const tablesResult = await client.query(\`
                    SELECT tablename
                    FROM pg_tables
                    WHERE schemaname = 'public'
                    AND tablename NOT LIKE 'pg_%'
                    AND tablename NOT LIKE 'information_%'
                \`);

                // Get all user-defined enum types
                const enumsResult = await client.query(\`
                    SELECT typname
                    FROM pg_type
                    WHERE typcategory = 'E'
                    AND typname NOT LIKE 'pg_%'
                \`);

                // Drop tables first
                if (tablesResult.rows.length > 0) {
                    console.log('Dropping existing tables:', tablesResult.rows.map(r => r.tablename).join(', '));
                    for (const row of tablesResult.rows) {
                        await client.query(\`DROP TABLE IF EXISTS \"\${row.tablename}\" CASCADE\`);
                    }
                    console.log('Tables dropped successfully');
                } else {
                    console.log('No existing tables found');
                }

                // Drop enum types
                if (enumsResult.rows.length > 0) {
                    console.log('Dropping existing enum types:', enumsResult.rows.map(r => r.typname).join(', '));
                    for (const row of enumsResult.rows) {
                        await client.query(\`DROP TYPE IF EXISTS \"\${row.typname}\" CASCADE\`);
                    }
                    console.log('Enum types dropped successfully');
                } else {
                    console.log('No existing enum types found');
                }

                // Also drop the drizzle migrations table to reset migration state
                await client.query('DROP TABLE IF EXISTS drizzle.__drizzle_migrations CASCADE');
                console.log('Migration tracking table reset');

            } catch (err) {
                console.error('Error cleaning database:', err.message);
                process.exit(1);
            } finally {
                await client.end();
            }
        }

        cleanDatabase();
    "

    # Ensure migrations directory and journal exist
    print_status "Setting up migration structure..."
    mkdir -p src/db/migrations/meta

    # Create journal.json if it doesn't exist
    if [ ! -f "src/db/migrations/meta/_journal.json" ]; then
        print_status "Creating migration journal..."
        cat > src/db/migrations/meta/_journal.json << 'EOF'
{
  "version": "7",
  "dialect": "postgresql",
  "entries": []
}
EOF
        print_success "Migration journal created"
    else
        print_success "Migration journal exists"
    fi

    cd ..

    # Generate and run migrations
    print_status "Generating database migrations..."
    cd backend
    pnpm db:generate

    print_status "Running database migrations..."
    pnpm db:migrate
    cd ..

    print_success "Database setup complete"
}

# Seed database with Faker data
seed_database() {
    print_status "Seeding database with sample data..."

    cd backend
    pnpm exec tsx scripts/seed-database.ts
    cd ..

    print_success "Database seeded with sample data"
}

# Generate types
generate_types() {
    print_status "Generating API types..."
    cd openapi
    if [ -f "package.json" ] && grep -q "generate-types" package.json; then
        pnpm run generate-types
    else
        print_warning "No generate-types script found in openapi package"
    fi
    cd ..
    print_success "Type generation complete"
}

# Lint and fix code
lint_and_fix() {
    print_status "Running lint and auto-fix..."
    pnpm lint:fix
    print_success "Lint and fix complete"
}

# Main setup function
main() {
    print_status "Starting application setup..."
    echo

    check_prerequisites
    echo

    setup_environment
    echo

    install_dependencies
    echo

    setup_database
    echo

    seed_database
    echo

    generate_types
    echo

    lint_and_fix
    echo

    print_success "Setup complete! 🎉"
    echo
    print_status "To start the application:"
    print_status "  ./run.sh"
    echo
    print_status "Or start services individually:"
    print_status "  Backend:  cd backend && pnpm dev"
    print_status "  Frontend: cd frontend && pnpm dev"
    echo
    print_status "Application URLs:"
    if command_exists caddy; then
        print_status "  🌐 Main App:  http://localhost:8080 (recommended)"
        print_status "  📱 Frontend:  http://localhost:5173 (direct)"
        print_status "  ⚙️  Backend:   http://localhost:3001 (direct)"
    else
        print_status "  📱 Frontend: http://localhost:5173"
        print_status "  ⚙️  Backend:  http://localhost:3001"
        print_status "  💡 Install Caddy for http://localhost:8080 access"
    fi
}

# Run main function
main "$@"
