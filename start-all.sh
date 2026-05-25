#!/bin/bash
# Start all JustSearch services for localhost development
# Backend: 3001 | Customer: 3005 | Dashboard: 3002 | Admin: 3003 | Delivery: 3004

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "═══════════════════════════════════════════════════"
echo "  JustSearch Localhost Development Launcher"
echo "═══════════════════════════════════════════════════"
echo ""
echo "  Backend API        → http://localhost:3001"
echo "  Customer Frontend  → http://localhost:3005  (naples)"
echo "  Restaurant Dash    → http://localhost:3002  (naples admin)"
echo "  JustSearch Admin   → http://localhost:3003"
echo "  Delivery Portal    → http://localhost:3004  (naples delivery)"
echo ""
echo "  Press Ctrl+C to stop ALL services"
echo "═══════════════════════════════════════════════════"
echo ""

# Kill existing processes on these ports
echo "🧹 Cleaning up existing processes..."
for port in 3001 3002 3003 3004 3005; do
  lsof -ti :$port | xargs kill -9 2>/dev/null || true
done
sleep 1

# Function to start a service in background
start_service() {
  local name=$1
  local filter=$2
  local port=$3
  local url=$4

  echo "🚀 Starting $name on port $port..."
  pnpm --filter "$filter" dev > /tmp/justsearch-$port.log 2>&1 &
  echo $! > /tmp/justsearch-$port.pid
}

# Start all services
start_service "Backend API" "backend" 3001 "http://localhost:3001"
sleep 2

start_service "Customer Frontend" "customer-frontend" 3005 "http://localhost:3005"
start_service "Restaurant Dashboard" "restaurant-dashboard" 3002 "http://localhost:3002"
start_service "JustSearch Admin" "justsearch-admin" 3003 "http://localhost:3003"
start_service "Delivery Portal" "delivery-portal" 3004 "http://localhost:3004"

echo ""
echo "⏳ Waiting for services to start..."
sleep 5

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ ALL SERVICES STARTED"
echo "═══════════════════════════════════════════════════"
echo ""
echo "  🍽️  Customer:    http://localhost:3005"
echo "  🖥️  Dashboard:   http://localhost:3002"
echo "  👤 Admin:       http://localhost:3003"
echo "  🛵 Delivery:    http://localhost:3004"
echo "  🔌 API:         http://localhost:3001"
echo ""
echo "  Default tenant: naples (all data loaded)"
echo ""
echo "  Log files: /tmp/justsearch-*.log"
echo "═══════════════════════════════════════════════════"

# Wait for all background processes
wait
