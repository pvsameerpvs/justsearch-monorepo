#!/bin/bash
# Run this script with: sudo bash setup-localhosts.sh

echo "Adding localhost subdomains for JustSearch testing..."

if ! grep -q "naples.localhost" /etc/hosts; then
  echo "127.0.0.1 naples.localhost" >> /etc/hosts
  echo "✅ Added naples.localhost"
else
  echo "ℹ️  naples.localhost already exists"
fi

if ! grep -q "hotgrill.localhost" /etc/hosts; then
  echo "127.0.0.1 hotgrill.localhost" >> /etc/hosts
  echo "✅ Added hotgrill.localhost"
else
  echo "ℹ️  hotgrill.localhost already exists"
fi

echo ""
echo "Done! You can now test at:"
echo "  http://naples.localhost:3005     (Customer Frontend - Naples)"
echo "  http://hotgrill.localhost:3005   (Customer Frontend - Hotgrill)"
echo "  http://naples.localhost:3002     (Restaurant Dashboard)"
echo "  http://naples.localhost:3004     (Delivery Portal)"
echo "  http://localhost:3003            (JustSearch Admin)"
