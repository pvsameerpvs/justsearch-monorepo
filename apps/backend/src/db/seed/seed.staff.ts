import bcrypt from 'bcrypt';
import { db } from '../index';
import { staff, deliveryAgents, restaurantTables } from '../schema';

const DEFAULT_STAFF_PASSWORD = process.env.SEED_STAFF_PASSWORD || 'owner123';
const DEFAULT_RIDER_PASSWORD = process.env.SEED_RIDER_PASSWORD || 'rider123';

export async function seedStaff(restaurantId: string) {
  const hashedPassword = await bcrypt.hash(DEFAULT_STAFF_PASSWORD, 12);
  await db
    .insert(staff)
    .values({
      restaurantId,
      name: 'Omar Hassan',
      username: 'owner_mosaic',
      passwordHash: hashedPassword,
      role: 'owner',
      permissions: JSON.stringify({ all: true }),
    })
    .returning();
}

export async function seedDeliveryAgent(restaurantId: string) {
  const agentPassword = await bcrypt.hash(DEFAULT_RIDER_PASSWORD, 12);
  await db
    .insert(deliveryAgents)
    .values({
      restaurantId,
      name: 'Samira Khan',
      phone: '+971 52 880 4412',
      username: 'samira_khan',
      passwordHash: agentPassword,
      vehicleType: 'scooter',
      status: 'online',
      rating: '4.9',
      completedToday: 14,
      shiftLabel: '12:00 PM to 8:00 PM',
    })
    .returning();
}

export async function seedTable(restaurantId: string) {
  await db
    .insert(restaurantTables)
    .values({
      restaurantId,
      tableNumber: 'T1',
      capacity: 4,
      status: 'available',
    })
    .returning();
}
