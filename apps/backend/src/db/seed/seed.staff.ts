import bcrypt from 'bcrypt';
import { db } from '../index';
import { staff, deliveryAgents, restaurantTables } from '../schema';

export async function seedStaff(restaurantId: string) {
  const hashedPassword = await bcrypt.hash('owner123', 12);
  const [owner] = await db
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
  console.log('Created staff:', owner.name);
}

export async function seedDeliveryAgent(restaurantId: string) {
  const agentPassword = await bcrypt.hash('rider123', 12);
  const [agent] = await db
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
  console.log('Created delivery agent:', agent.name);
}

export async function seedTable(restaurantId: string) {
  const [table] = await db
    .insert(restaurantTables)
    .values({
      restaurantId,
      tableNumber: 'T1',
      capacity: 4,
      status: 'available',
    })
    .returning();
  console.log('Created table:', table.tableNumber);
}
