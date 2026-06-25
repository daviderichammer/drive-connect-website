#!/bin/bash
# Drive Connect - Deployment Script
# Run this on the Hetzner server (5.161.189.93) to deploy or update the site
# Usage: bash deploy.sh

set -e

echo "=== Drive Connect Deployment ==="
echo "Server: 5.161.189.93"
echo "Time: $(date)"
echo ""

# Configuration
REPO_URL="https://github.com/daviderichammer/drive-connect-website.git"
APP_DIR="/opt/drive-connect"
BRANCH="main"
MYSQL_ROOT_PASS="SecureRootPass123!"
DC_DB_USER="drive_connect_user"
DC_DB_PASS="DriveConnect2024!"
DC_DB_NAME="drive_connect"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ── 1. Ensure Docker is installed ──────────────────────────────────────────────
if ! command -v docker &> /dev/null; then
    log_info "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

if ! docker compose version &> /dev/null; then
    log_info "Installing Docker Compose plugin..."
    apt-get update -qq && apt-get install -y docker-compose-plugin
fi

log_info "Docker: $(docker --version)"
log_info "Docker Compose: $(docker compose version)"

# ── 2. Set up MySQL database for Drive Connect ─────────────────────────────────
log_info "Setting up MySQL database..."

# Check if MySQL is running
if ! mysqladmin -u root -p"$MYSQL_ROOT_PASS" ping --silent 2>/dev/null; then
    log_error "MySQL is not running or root password is incorrect"
    exit 1
fi

# Create database and user (idempotent)
mysql -u root -p"$MYSQL_ROOT_PASS" <<EOF
CREATE DATABASE IF NOT EXISTS ${DC_DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DC_DB_USER}'@'%' IDENTIFIED BY '${DC_DB_PASS}';
CREATE USER IF NOT EXISTS '${DC_DB_USER}'@'localhost' IDENTIFIED BY '${DC_DB_PASS}';
GRANT ALL PRIVILEGES ON ${DC_DB_NAME}.* TO '${DC_DB_USER}'@'%';
GRANT ALL PRIVILEGES ON ${DC_DB_NAME}.* TO '${DC_DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOF

log_info "MySQL database '${DC_DB_NAME}' ready"

# Create tables if they don't exist
mysql -u root -p"$MYSQL_ROOT_PASS" "$DC_DB_NAME" <<EOF
CREATE TABLE IF NOT EXISTS partner_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  businessName VARCHAR(255) NOT NULL,
  ownerName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  primaryCity VARCHAR(255) NOT NULL,
  additionalCities TEXT,
  numberOfVehicles INT DEFAULT 0,
  vehicleTypes TEXT,
  currentPlatforms TEXT,
  turoProfileUrl VARCHAR(500),
  offersAirportDelivery TINYINT(1) DEFAULT 0,
  offersHomeDelivery TINYINT(1) DEFAULT 0,
  hasCommercialInsurance TINYINT(1) DEFAULT 0,
  supportsSameDayBookings TINYINT(1) DEFAULT 0,
  operates24x7 TINYINT(1) DEFAULT 0,
  wouldUseDCSupport TINYINT(1) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
EOF

log_info "Database tables ready"

# ── 3. Allow MySQL to accept connections from Docker containers ────────────────
log_info "Configuring MySQL to accept Docker connections..."

# Check if MySQL is bound to 127.0.0.1 only and update if needed
MYSQL_BIND=$(mysql -u root -p"$MYSQL_ROOT_PASS" -e "SHOW VARIABLES LIKE 'bind_address';" 2>/dev/null | grep bind_address | awk '{print $2}')
log_info "MySQL bind address: $MYSQL_BIND"

# Update MySQL config to allow connections from Docker network
if [ -f /etc/mysql/mysql.conf.d/mysqld.cnf ]; then
    if grep -q "^bind-address.*127.0.0.1" /etc/mysql/mysql.conf.d/mysqld.cnf; then
        log_info "Updating MySQL bind address to allow Docker connections..."
        sed -i 's/^bind-address.*=.*127.0.0.1/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf
        systemctl restart mysql
        sleep 3
        log_info "MySQL restarted with updated bind address"
    fi
fi

# ── 4. Clone or update the repository ─────────────────────────────────────────
if [ ! -d "$APP_DIR" ]; then
    log_info "Creating app directory: $APP_DIR"
    mkdir -p "$APP_DIR"
fi

cd "$APP_DIR"

if [ -d ".git" ]; then
    log_info "Pulling latest code..."
    git fetch origin
    git reset --hard origin/$BRANCH
else
    log_info "Cloning repository..."
    git clone -b $BRANCH "$REPO_URL" .
fi

log_info "Deployed commit: $(git log --oneline -1)"

# ── 5. Write production env file ───────────────────────────────────────────────
cat > .env.production << ENVEOF
DATABASE_URL=mysql://${DC_DB_USER}:${DC_DB_PASS}@host.docker.internal:3306/${DC_DB_NAME}
NEXT_PUBLIC_SITE_URL=http://5.161.189.93
NODE_ENV=production
ENVEOF

log_info "Production env file written"

# ── 6. Stop existing containers and rebuild ────────────────────────────────────
log_info "Stopping existing containers..."
docker compose down --remove-orphans 2>/dev/null || true

# Check if port 80 is in use by something other than Docker
if ss -tlnp | grep ':80 ' | grep -v docker; then
    log_warn "Port 80 may be in use. Attempting to free it..."
    systemctl stop nginx 2>/dev/null || true
    systemctl stop apache2 2>/dev/null || true
fi

log_info "Building and starting containers..."
docker compose up -d --build

# ── 7. Verify deployment ───────────────────────────────────────────────────────
log_info "Waiting for app to start (30s)..."
sleep 30

log_info "Container status:"
docker compose ps

log_info "Testing site..."
for i in 1 2 3 4 5; do
    if curl -sf http://localhost/health > /dev/null 2>&1; then
        log_info "✅ Site is live at http://5.161.189.93"
        break
    elif curl -sf http://localhost:3000 > /dev/null 2>&1; then
        log_info "✅ App running on port 3000 (Nginx may still be starting)"
        break
    else
        log_warn "Attempt $i/5: Site not responding yet, waiting 10s..."
        sleep 10
    fi
done

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║         Drive Connect Deployment Complete            ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  Site URL:  http://5.161.189.93                      ║"
echo "║  Logs:      docker compose logs -f                   ║"
echo "║  Status:    docker compose ps                        ║"
echo "║  Restart:   docker compose restart                   ║"
echo "╚══════════════════════════════════════════════════════╝"
