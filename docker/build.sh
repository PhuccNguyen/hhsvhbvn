#!/bin/bash

# HHSV Build & Deploy Script
set -e

echo "🚀 HHSV Docker Build & Deploy Script"
echo "======================================"

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

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local file not found!"
    print_status "Creating .env.local template..."
    cat > .env.local << EOF
# Google Sheets Configuration
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SHEET_ID=your-google-sheet-id
GOOGLE_PRIVATE_KEY_B64=your-base64-private-key

# Next.js Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3301
EOF
    print_warning "Please update .env.local with your actual values before building!"
    exit 1
fi

# Navigate to docker directory
cd docker

print_status "Building Docker images..."
docker-compose build --no-cache

print_status "Starting services..."
docker-compose up -d

print_status "Waiting for services to be healthy..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    print_success "Services are running!"
    print_status "Application URLs:"
    echo "  • Direct access: http://localhost:3301"
    echo "  • Through Nginx: http://localhost"
    echo ""
    print_status "Useful commands:"
    echo "  • View logs: docker-compose logs -f"
    echo "  • Stop services: docker-compose down"
    echo "  • Restart: docker-compose restart"
    echo "  • View status: docker-compose ps"
else
    print_error "Services failed to start!"
    print_status "Checking logs..."
    docker-compose logs
    exit 1
fi