#!/usr/bin/env node
/**
 * Quick test: Verify Naples data is accessible through the API
 * Run this after backend is started on localhost:3001
 */

const API_BASE = 'http://localhost:3001/api/v1';

async function apiCall(path, slug = 'naples') {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'x-restaurant-slug': slug },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown');
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json().catch(() => ({}));
}

async function main() {
  console.log('🔍 Checking Naples data via API...\n');

  try {
    const current = await apiCall('/restaurants/current');
    console.log('✅ Restaurant:', current.name || current.slug);
  } catch (e) {
    console.log('❌ Restaurant:', e.message);
  }

  try {
    const menu = await apiCall('/menus');
    console.log('✅ Menu:', menu.categories?.length || 0, 'categories');
  } catch (e) {
    console.log('❌ Menu:', e.message);
  }

  try {
    const items = await apiCall('/menu-items');
    console.log('✅ Menu Items:', items.items?.length || 0, 'items');
  } catch (e) {
    console.log('❌ Menu Items:', e.message);
  }

  try {
    const orders = await apiCall('/orders');
    console.log('✅ Orders:', orders.orders?.length || 0, 'orders');
  } catch (e) {
    console.log('❌ Orders:', e.message);
  }

  try {
    const agents = await apiCall('/delivery-agents');
    console.log('✅ Delivery Agents:', agents.agents?.length || 0, 'agents');
  } catch (e) {
    console.log('❌ Delivery Agents:', e.message);
  }

  try {
    const vouchers = await apiCall('/vouchers');
    console.log('✅ Vouchers:', vouchers.vouchers?.length || 0, 'vouchers');
  } catch (e) {
    console.log('❌ Vouchers:', e.message);
  }

  console.log('\n🎉 All checks complete!');
}

main().catch(e => {
  console.error('\n💥 Error:', e.message);
  console.log('\nMake sure backend is running: pnpm --filter backend dev');
  process.exit(1);
});
