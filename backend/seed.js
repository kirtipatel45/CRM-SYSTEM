import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/modules/users/user.model.js';
import Role from './src/modules/roles/role.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crm_system';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    const resources = [
      'Dashboard', 'Leads', 'Customers', 'Deals', 'Marketing', 
      'Campaigns', 'Teams', 'Users', 'Reports', 'Settings'
    ];
    const actions = ['create', 'read', 'update', 'delete', 'assign', 'export', 'import', 'manage'];

    const permissions = resources.map(resource => ({ resource, actions }));

    // Create Admin Role
    let adminRole = await Role.findOne({ name: 'Admin' });
    if (!adminRole) {
      adminRole = new Role({
        name: 'Admin',
        permissions,
        isSystem: true
      });
      await adminRole.save();
      console.log('Admin role created.');
    } else {
      console.log('Admin role already exists.');
    }

    // Create Admin User
    const adminEmail = 'admin@example.com';
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      adminUser = new User({
        name: 'Super Admin',
        email: adminEmail,
        password: 'password123',
        role: adminRole._id,
        isActive: true
      });
      await adminUser.save();
      console.log(`Admin user created: ${adminEmail} / password123`);
    } else {
      console.log('Admin user already exists.');
      // Optional: Reset password
      adminUser.password = 'password123';
      await adminUser.save();
      console.log(`Admin user password reset to: password123`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
