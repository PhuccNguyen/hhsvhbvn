# HHSV Docker Management Makefile

.PHONY: help build up down restart logs status clean rebuild

# Default target
help:
	@echo "🚀 HHSV Docker Management Commands"
	@echo "=================================="
	@echo ""
	@echo "Available commands:"
	@echo "  build     - Build Docker images"
	@echo "  up        - Start all services"
	@echo "  down      - Stop all services"
	@echo "  restart   - Restart all services"
	@echo "  logs      - View logs (use 'make logs SERVICE=hhsvhbvn-app' for specific service)"
	@echo "  status    - Show service status"
	@echo "  clean     - Remove all containers and images"
	@echo "  rebuild   - Clean build and restart"
	@echo "  shell     - Access container shell"
	@echo ""

# Build Docker images
build:
	@echo "🔨 Building Docker images..."
	cd docker && docker-compose build --no-cache

# Start services
up:
	@echo "🚀 Starting services..."
	cd docker && docker-compose up -d
	@echo "✅ Services started!"
	@echo "📱 App: http://localhost:3301"
	@echo "🌐 Nginx: http://localhost"

# Stop services
down:
	@echo "🛑 Stopping services..."
	cd docker && docker-compose down
	@echo "✅ Services stopped!"

# Restart services
restart:
	@echo "🔄 Restarting services..."
	cd docker && docker-compose restart
	@echo "✅ Services restarted!"

# View logs
logs:
	@echo "📋 Viewing logs..."
ifdef SERVICE
	cd docker && docker-compose logs -f $(SERVICE)
else
	cd docker && docker-compose logs -f
endif

# Show status
status:
	@echo "📊 Service Status:"
	cd docker && docker-compose ps

# Clean everything
clean:
	@echo "🧹 Cleaning up..."
	cd docker && docker-compose down -v --rmi all --remove-orphans
	@echo "✅ Cleanup complete!"

# Rebuild everything
rebuild: clean build up

# Access container shell
shell:
	@echo "🐚 Accessing container shell..."
	cd docker && docker-compose exec hhsvhbvn-app sh

# Development mode (with file watching)
dev:
	@echo "🔧 Starting in development mode..."
	cd docker && docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Production deployment
deploy:
	@echo "🚀 Deploying to production..."
	cd docker && docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d