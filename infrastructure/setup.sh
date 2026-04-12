#!/bin/bash
# Rhine Solution - Infrastructure Setup Script
# Copies production configurations to project root

set -e

echo "Setting up production infrastructure..."

# Copy nginx.conf to root if it exists
if [ -f "infrastructure/nginx.conf" ]; then
    cp infrastructure/nginx.conf nginx.conf
    echo "✓ Updated nginx.conf"
else
    echo "✗ infrastructure/nginx.conf not found"
fi

# Copy docker-compose.yml to root if it exists
if [ -f "infrastructure/docker-compose.yml" ]; then
    cp infrastructure/docker-compose.yml docker-compose.yml
    echo "✓ Updated docker-compose.yml"
else
    echo "✗ infrastructure/docker-compose.yml not found"
fi

# Make deploy script executable
if [ -f "infrastructure/deploy.sh" ]; then
    chmod +x infrastructure/deploy.sh
    ln -sf infrastructure/deploy.sh ./deploy.sh 2>/dev/null || true
    echo "✓ Created deploy.sh symlink"
fi

echo ""
echo "Setup complete! You can now:"
echo "  1. Review the updated configurations"
echo "  2. Run './deploy.sh build' to build the Docker image"
echo "  3. Run './deploy.sh deploy' to deploy to production"
