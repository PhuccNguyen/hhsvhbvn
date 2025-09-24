# 🐳 Docker Setup for HHSV Project

This directory contains Docker configuration for the HHSV (Hoa Hậu Sinh Viên Hòa Bình Việt Nam) project.

## 📋 Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+
- At least 2GB RAM available for containers

## 🚀 Quick Start

### Option 1: Using PowerShell Script (Windows)
```powershell
cd docker
powershell -ExecutionPolicy Bypass -File build.ps1
```

### Option 2: Using Make Commands
```bash
make build    # Build images
make up       # Start services
make logs     # View logs
make status   # Check status
```

### Option 3: Manual Docker Compose
```bash
cd docker
docker-compose build --no-cache
docker-compose up -d
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │   Next.js App   │    │   External APIs │
│   Port 80/443   │◄──►│   Port 3000     │◄──►│   Google Sheets │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the project root:

```env
# Google Sheets Configuration
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SHEET_ID=your-google-sheet-id
GOOGLE_PRIVATE_KEY_B64=your-base64-private-key

# Next.js Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3301
NODE_ENV=production
```

### Ports

- **3301**: Direct access to Next.js app
- **80**: Nginx proxy (production-like setup)
- **443**: HTTPS (when SSL certificates are configured)

## 📱 Access URLs

- **Application**: http://localhost:3301
- **Through Nginx**: http://localhost
- **Health Check**: http://localhost:3301/api/checkin

## 🛠️ Available Commands

### Make Commands (Recommended)
```bash
make help     # Show all available commands
make build    # Build Docker images
make up       # Start all services
make down     # Stop all services
make restart  # Restart services
make logs     # View logs (all services)
make logs SERVICE=hhsvhbvn-app  # View specific service logs
make status   # Show service status
make clean    # Remove all containers and images
make rebuild  # Clean build and restart
make shell    # Access container shell
```

### Docker Compose Commands
```bash
cd docker

# Build and start
docker-compose build --no-cache
docker-compose up -d

# View logs
docker-compose logs -f
docker-compose logs -f hhsvhbvn-app

# Stop services
docker-compose down

# Restart specific service
docker-compose restart hhsvhbvn-app

# Check status
docker-compose ps
```

## 🔍 Monitoring & Debugging

### Health Checks
The application includes health checks that monitor:
- Application startup (40s grace period)
- API endpoint availability
- Service dependencies

### Logs
```bash
# All services
make logs

# Specific service
docker-compose logs -f hhsvhbvn-app
docker-compose logs -f nginx

# Follow logs in real-time
docker-compose logs -f --tail=100
```

### Container Shell Access
```bash
make shell
# or
docker-compose exec hhsvhbvn-app sh
```

## 🚀 Production Deployment

### With Custom Domain
Update `nginx.conf` with your domain:
```nginx
server_name yourdomain.com www.yourdomain.com;
```

### With SSL Certificate
1. Add SSL certificates to `docker/ssl/` directory
2. Update nginx configuration for HTTPS
3. Modify docker-compose.yml to mount SSL certificates

### Environment-Specific Configs
- Development: `docker-compose.dev.yml`
- Production: `docker-compose.prod.yml`

## 🛡️ Security Features

- Non-root user execution
- Resource limits
- Health checks
- Proper network isolation
- Environment variable validation

## 📊 Performance Optimizations

- Multi-stage Docker builds
- Build cache optimization
- Standalone Next.js output
- Nginx proxy with buffering
- Resource limits and requests

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change ports in docker-compose.yml
   ports:
     - "3302:3000"  # Use different port
   ```

2. **Build fails**
   ```bash
   make clean    # Clean everything
   make build    # Rebuild
   ```

3. **Environment variables not loaded**
   - Check `.env.local` exists in project root
   - Verify file format and encoding

4. **Google Sheets connection fails**
   - Verify base64 encoding of private key
   - Check service account permissions
   - Validate environment variables

### Debug Mode
```bash
# Build with debug info
docker-compose build --no-cache --progress=plain

# Run with debug logs
docker-compose up --verbose
```

## 📈 Scaling

To scale the application:
```bash
docker-compose up -d --scale hhsvhbvn-app=3
```

Update nginx.conf for load balancing:
```nginx
upstream hhsvhbvn-website {
    server hhsvhbvn-app:3000;
    server hhsvhbvn-app:3000;
    server hhsvhbvn-app:3000;
}
```

## 🔄 Updates

To update the application:
```bash
git pull origin main
make rebuild
```

## 📞 Support

If you encounter issues:
1. Check logs: `make logs`
2. Verify environment variables
3. Ensure Docker Desktop is running
4. Check port availability