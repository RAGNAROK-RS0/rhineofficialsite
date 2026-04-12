#!/bin/bash
set -e

# Rhine Solution - Production Deployment Script
# =============================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo_step() {
    echo -e "${GREEN}[STEP]${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    echo_step "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        echo_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    echo_step "Prerequisites check passed."
}

# Build the application
build() {
    echo_step "Building Docker image..."
    docker build \
        --build-arg VITE_SUPABASE_URL="$VITE_SUPABASE_URL" \
        --build-arg VITE_SUPABASE_ANON_KEY="$VITE_SUPABASE_ANON_KEY" \
        -t rhine-app:latest \
        -t rhine-app:$(git rev-parse --short HEAD 2>/dev/null || echo "latest") \
        .
    echo_step "Build complete."
}

# Deploy using docker-compose
deploy() {
    echo_step "Deploying application..."
    
    # Stop existing containers
    docker compose down || true
    
    # Start new containers
    docker compose up -d
    
    # Wait for health check
    echo_step "Waiting for application to be healthy..."
    sleep 10
    
    # Check health
    if curl -sf http://localhost/healthz > /dev/null; then
        echo_step "Application is healthy!"
    else
        echo_error "Application health check failed."
        docker compose logs
        exit 1
    fi
}

# Run database migrations (if applicable)
migrate() {
    echo_step "Running migrations..."
    # Add migration commands here if needed
    echo_step "Migrations complete."
}

# Rollback to previous version
rollback() {
    echo_warn "Rolling back to previous version..."
    docker compose down
    docker tag rhine-app:previous rhine-app:latest
    docker compose up -d
    echo_step "Rollback complete."
}

# Show logs
logs() {
    docker compose logs -f --tail=100
}

# Show status
status() {
    echo_step "Application status:"
    docker compose ps
    echo ""
    echo_step "Health check:"
    curl -s http://localhost/healthz || echo "Failed"
}

# Main command router
case "${1:-deploy}" in
    build)
        check_prerequisites
        build
        ;;
    deploy)
        check_prerequisites
        build
        migrate
        deploy
        status
        ;;
    rollback)
        rollback
        ;;
    logs)
        logs
        ;;
    status)
        status
        ;;
    restart)
        docker compose restart
        status
        ;;
    clean)
        echo_warn "Cleaning up Docker resources..."
        docker compose down -v --rmi local
        ;;
    *)
        echo "Usage: $0 {build|deploy|rollback|logs|status|restart|clean}"
        echo ""
        echo "Commands:"
        echo "  build     - Build Docker image"
        echo "  deploy    - Build and deploy application (default)"
        echo "  rollback  - Rollback to previous version"
        echo "  logs      - Show application logs"
        echo "  status    - Show application status"
        echo "  restart   - Restart application"
        echo "  clean     - Remove containers and images"
        exit 1
        ;;
esac

echo_step "Done!"
