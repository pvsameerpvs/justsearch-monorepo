import bcrypt from 'bcrypt';
import { db } from '../index';
import { users, superAdmins } from '../schema';

export async function seedCustomer(restaurantId: string) {
  const [customer] = await db
    .insert(users)
    .values({
      restaurantId,
      phone: '+971501234567',
      name: 'Amina Hassan',
      role: 'customer',
      isActive: true,
    })
    .returning();
  console.log('Created customer:', customer.name);
}

export async function seedSuperAdmin() {
  const [superAdmin] = await db
    .insert(superAdmins)
    .values({
      name: 'Platform Admin',
      username: 'admin',
      passwordHash: await bcrypt.hash('admin123', 12),
      email: 'admin@justsearch.com',
      isActive: true,
    })
    .returning();
  console.log('Created super admin:', superAdmin.name);
}
