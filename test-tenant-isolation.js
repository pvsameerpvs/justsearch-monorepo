#!/usr/bin/env node
/**
 * Automated Tenant Isolation Test Script
 *
 * This script tests the fix by placing orders from multiple restaurants
 * and verifying they land in the correct database schemas.
 *
 * Usage:
 *   node test-tenant-isolation.js
 *
 * Prerequisites:
 *   - Backend running on http://localhost:3001
 *   - Supabase database accessible
 *   - At least one restaurant (naples) active in the database
 */

const API_BASE = 'http://localhost:3001/api/v1';

// Test customer phone number
const TEST_MOBILE = '971501234567';
const TEST_NAME = 'Isolation Test User';

// Restaurant configs
const RESTAURANTS = [
  { slug: 'naples', name: 'Naples Cafeteria' },
  { slug: 'hotgrill', name: 'Hotgrill' },
];

let accessToken = null;

async function apiCall(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(options.headers);
  if (!headers.has('content-type') && options.body) {
    headers.set('content-type', 'application/json');
  }
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error');
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return res.json().catch(() => ({}));
}

async function login(slug) {
  console.log(`\n🔐 Logging in as ${slug} customer...`);

  // Step 1: Request OTP
  const otpReq = await apiCall('/auth/otp/request', {
    method: 'POST',
    headers: { 'x-restaurant-slug': slug },
    body: JSON.stringify({ mobile: TEST_MOBILE, name: TEST_NAME }),
  });

  console.log(`  OTP Request: ${otpReq.flow}`);
  const demoOtp = otpReq.demoOtp;
  if (!demoOtp) {
    throw new Error('No demoOtp returned. Make sure DEBUG_OTP=true in backend .env');
  }
  console.log(`  Demo OTP: ${demoOtp}`);

  // Step 2: Verify OTP
  const verify = await apiCall('/auth/otp/verify', {
    method: 'POST',
    headers: { 'x-restaurant-slug': slug },
    body: JSON.stringify({
      requestId: otpReq.requestId,
      mobile: TEST_MOBILE,
      otp: demoOtp,
    }),
  });

  accessToken = verify.accessToken;
  console.log(`  ✅ Logged in. Token received.`);
}

async function placeOrder(slug, restaurantName, itemName, total) {
  console.log(`\n📦 Placing order on ${restaurantName}...`);

  const order = await apiCall('/orders', {
    method: 'POST',
    headers: { 'x-restaurant-slug': slug },
    body: JSON.stringify({
      customerName: TEST_NAME,
      customerPhone: TEST_MOBILE,
      fulfillmentType: 'pickup',
      subtotal: total,
      deliveryFee: 0,
      tax: 0,
      total: total,
      items: [{
        menuItemId: '00000000-0000-0000-0000-000000000001',
        name: itemName,
        quantity: 1,
        price: total,
      }],
    }),
  });

  console.log(`  ✅ Order placed: ${order.order.code}`);
  return order.order;
}

async function fetchMyOrders() {
  console.log(`\n📋 Fetching my orders...`);
  const data = await apiCall('/orders/my-all', {
    headers: { 'x-restaurant-slug': 'naples' },
  });

  const recent = data.orders.slice(0, 5);
  console.log(`  Found ${data.orders.length} total orders`);
  recent.forEach((o) => {
    console.log(`    - ${o.code} | ${o.restaurantName} | ${o.status} | ${o.total}`);
  });
  return data.orders;
}

async function runTest() {
  console.log('═══════════════════════════════════════════════');
  console.log('  TENANT ISOLATION TEST');
  console.log('═══════════════════════════════════════════════');
  console.log(`API: ${API_BASE}`);
  console.log(`Customer: ${TEST_MOBILE}`);

  const results = [];

  for (const restaurant of RESTAURANTS) {
    try {
      // Login for this restaurant
      await login(restaurant.slug);

      // Place order
      const order = await placeOrder(
        restaurant.slug,
        restaurant.name,
        `${restaurant.name} Special`,
        restaurant.slug === 'naples' ? 55 : 35
      );

      results.push({
        slug: restaurant.slug,
        name: restaurant.name,
        code: order.code,
        id: order.id,
        success: true,
      });
    } catch (err) {
      console.error(`  ❌ Failed for ${restaurant.name}: ${err.message}`);
      results.push({
        slug: restaurant.slug,
        name: restaurant.name,
        success: false,
        error: err.message,
      });
    }
  }

  // Fetch all orders
  await login('naples');
  const allOrders = await fetchMyOrders();

  // Verification
  console.log('\n═══════════════════════════════════════════════');
  console.log('  VERIFICATION');
  console.log('═══════════════════════════════════════════════');

  for (const result of results) {
    if (!result.success) continue;

    const found = allOrders.find((o) => o.code === result.code);
    if (!found) {
      console.log(`  ⚠️  Order ${result.code} not found in my-all list`);
      continue;
    }

    const correctName = found.restaurantName?.toLowerCase().replace(/\s/g, '') === result.name?.toLowerCase().replace(/\s/g, '');
    const display = correctName ? '✅' : '❌ NAME MISMATCH';
    console.log(`  ${display} ${result.code} → ${found.restaurantName} (expected: ${result.name})`);
  }

  console.log('\n═══════════════════════════════════════════════');
  console.log('  NEXT STEPS');
  console.log('═══════════════════════════════════════════════');
  console.log('  1. Check Supabase SQL Editor:');
  console.log('     SELECT * FROM rest_naples.orders WHERE code = \'JS-XXXX\';');
  console.log('     SELECT * FROM rest_hotgrill.orders WHERE code = \'JS-XXXX\';');
  console.log('');
  console.log('  2. If any order shows wrong restaurantName above,');
  console.log('     the isolation bug is NOT fixed.');
  console.log('');
  console.log('  3. If all ✅, the fix is working correctly!');
  console.log('═══════════════════════════════════════════════');
}

runTest().catch((err) => {
  console.error('\n💥 Test failed:', err.message);
  process.exit(1);
});
