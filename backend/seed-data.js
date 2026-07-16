import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from './src/modules/roles/role.model.js';
import User from './src/modules/users/user.model.js';
import Lead from './src/modules/leads/lead.model.js';
import Customer from './src/modules/customers/customer.model.js';
import Deal from './src/modules/deals/deal.model.js';
import Campaign from './src/modules/campaigns/campaign.model.js';
import Task from './src/modules/tasks/task.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crm_system';

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding sample data...');

    // Get Admin User to use as owner
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    const adminId = adminUser ? adminUser._id : null;

    // 1. Roles (Settings)
    const rolesData = [
      { name: 'Sales Manager', isSystem: false, permissions: [{ resource: 'Leads', actions: ['create', 'read', 'update', 'delete'] }, { resource: 'Deals', actions: ['create', 'read', 'update', 'delete'] }, { resource: 'Customers', actions: ['create', 'read', 'update', 'delete'] }] },
      { name: 'Marketing Specialist', isSystem: false, permissions: [{ resource: 'Campaigns', actions: ['create', 'read', 'update', 'delete'] }, { resource: 'Leads', actions: ['read'] }] },
      { name: 'Support Agent', isSystem: false, permissions: [{ resource: 'Customers', actions: ['read', 'update'] }] },
      { name: 'Data Analyst', isSystem: false, permissions: [{ resource: 'Reports', actions: ['read'] }] },
      { name: 'HR Manager', isSystem: false, permissions: [{ resource: 'Users', actions: ['create', 'read', 'update', 'delete'] }] }
    ];
    for (const data of rolesData) {
      await Role.findOneAndUpdate({ name: data.name }, data, { upsert: true });
    }
    console.log('Roles seeded.');

    // 2. Customers
    const customersData = [
      { company: 'TechCorp Solutions', contactPerson: 'Alice Johnson', email: 'alice@techcorp.com', phone: '555-0101', industry: 'Software', revenue: 1500000, owner: adminId },
      { company: 'Global Logistics', contactPerson: 'Bob Smith', email: 'bob@global.com', phone: '555-0102', industry: 'Transportation', revenue: 3200000, owner: adminId },
      { company: 'Green Energy Ltd', contactPerson: 'Charlie Brown', email: 'charlie@greenenergy.com', phone: '555-0103', industry: 'Energy', revenue: 850000, owner: adminId },
      { company: 'Prime Retail', contactPerson: 'Diana Prince', email: 'diana@primeretail.com', phone: '555-0104', industry: 'Retail', revenue: 4500000, owner: adminId },
      { company: 'MediCare Health', contactPerson: 'Evan Wright', email: 'evan@medicare.com', phone: '555-0105', industry: 'Healthcare', revenue: 2100000, owner: adminId }
    ];
    await Customer.deleteMany({ company: { $in: customersData.map(c => c.company) } });
    const createdCustomers = await Customer.insertMany(customersData);
    console.log('Customers seeded.');

    // 3. Leads
    const leadsData = [
      { firstName: 'Sarah', lastName: 'Connor', email: 'sarah@skynet.com', phone: '555-0201', company: 'Skynet Cybernetics', jobTitle: 'Security Lead', status: 'New', source: 'Website', priority: 'High', value: 50000, owner: adminId },
      { firstName: 'John', lastName: 'Doe', email: 'john@startup.io', phone: '555-0202', company: 'Startup.io', jobTitle: 'CEO', status: 'Contacted', source: 'LinkedIn', priority: 'Medium', value: 15000, owner: adminId },
      { firstName: 'Jane', lastName: 'Smith', email: 'jane@enterprise.co', phone: '555-0203', company: 'Enterprise Co', jobTitle: 'VP Sales', status: 'Qualified', source: 'Referral', priority: 'High', value: 120000, owner: adminId },
      { firstName: 'Michael', lastName: 'Scott', email: 'mscott@dundermifflin.com', phone: '555-0204', company: 'Dunder Mifflin', jobTitle: 'Regional Manager', status: 'Proposal', source: 'Email', priority: 'Medium', value: 35000, owner: adminId },
      { firstName: 'Dwight', lastName: 'Schrute', email: 'dschrute@dundermifflin.com', phone: '555-0205', company: 'Dunder Mifflin', jobTitle: 'Assistant to the RM', status: 'Negotiation', source: 'Facebook', priority: 'Low', value: 5000, owner: adminId }
    ];
    await Lead.deleteMany({ email: { $in: leadsData.map(l => l.email) } });
    await Lead.insertMany(leadsData);
    console.log('Leads seeded.');

    // 4. Deals
    const dealsData = [
      { title: 'Enterprise Cloud Migration', value: 125000, customer: createdCustomers[0]._id, stage: 'Discovery', expectedCloseDate: new Date('2026-08-15'), probability: 30, owner: adminId },
      { title: 'Fleet Management Software', value: 85000, customer: createdCustomers[1]._id, stage: 'Proposal', expectedCloseDate: new Date('2026-09-01'), probability: 60, owner: adminId },
      { title: 'Solar Panel Dashboard', value: 45000, customer: createdCustomers[2]._id, stage: 'Negotiation', expectedCloseDate: new Date('2026-07-30'), probability: 85, owner: adminId },
      { title: 'POS System Upgrade', value: 250000, customer: createdCustomers[3]._id, stage: 'Won', expectedCloseDate: new Date('2026-07-10'), probability: 100, owner: adminId },
      { title: 'Patient Portal App', value: 95000, customer: createdCustomers[4]._id, stage: 'Lost', expectedCloseDate: new Date('2026-07-05'), probability: 0, owner: adminId }
    ];
    await Deal.deleteMany({ title: { $in: dealsData.map(d => d.title) } });
    await Deal.insertMany(dealsData);
    console.log('Deals seeded.');

    // 5. Campaigns (Marketing)
    const campaignsData = [
      { name: 'Q3 Product Launch', type: 'Email', status: 'Active', startDate: new Date('2026-07-01'), endDate: new Date('2026-09-30'), budget: 15000, metrics: { sent: 15000, opened: 4500, clicked: 1200, converted: 150 }, owner: adminId },
      { name: 'Summer Discount Promo', type: 'Social Media', status: 'Completed', startDate: new Date('2026-06-01'), endDate: new Date('2026-06-30'), budget: 5000, metrics: { sent: 50000, opened: 0, clicked: 3500, converted: 420 }, owner: adminId },
      { name: 'B2B Webinar Series', type: 'Webinar', status: 'Draft', startDate: new Date('2026-08-15'), endDate: new Date('2026-08-15'), budget: 2000, metrics: { sent: 0, opened: 0, clicked: 0, converted: 0 }, owner: adminId },
      { name: 'Holiday VIP Offers', type: 'SMS', status: 'Paused', startDate: new Date('2026-11-01'), endDate: new Date('2026-12-31'), budget: 8000, metrics: { sent: 1000, opened: 950, clicked: 400, converted: 85 }, owner: adminId },
      { name: 'Re-engagement Drip', type: 'Email', status: 'Active', startDate: new Date('2026-07-15'), endDate: new Date('2027-07-15'), budget: 3000, metrics: { sent: 2000, opened: 500, clicked: 100, converted: 12 }, owner: adminId }
    ];
    await Campaign.deleteMany({ name: { $in: campaignsData.map(c => c.name) } });
    await Campaign.insertMany(campaignsData);
    console.log('Campaigns seeded.');

    // 6. Tasks
    const tasksData = [
      { title: 'Follow up with TechCorp', description: 'Call Alice to discuss the cloud migration proposal.', status: 'To Do', priority: 'High', dueDate: new Date('2026-07-20'), assignee: adminId },
      { title: 'Prepare Q3 Marketing Report', description: 'Compile data from the recent campaigns.', status: 'In Progress', priority: 'Medium', dueDate: new Date('2026-07-25'), assignee: adminId },
      { title: 'Send contract to Green Energy', description: 'Finalize the terms and send via DocuSign.', status: 'To Do', priority: 'High', dueDate: new Date('2026-07-18'), assignee: adminId },
      { title: 'Update CRM roles', description: 'Add the new Support Agent permissions.', status: 'Done', priority: 'Low', dueDate: new Date('2026-07-15'), assignee: adminId },
      { title: 'Schedule product demo', description: 'Demo for the new retail POS system.', status: 'In Progress', priority: 'Medium', dueDate: new Date('2026-07-22'), assignee: adminId }
    ];
    await Task.deleteMany({ title: { $in: tasksData.map(t => t.title) } });
    await Task.insertMany(tasksData);
    console.log('Tasks seeded.');

    console.log('All sample data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
