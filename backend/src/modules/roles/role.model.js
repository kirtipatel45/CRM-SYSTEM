import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
  resource: {
    type: String,
    enum: [
      'Dashboard', 'Leads', 'Customers', 'Deals', 'Marketing', 
      'Campaigns', 'Teams', 'Users', 'Reports', 'Settings'
    ],
    required: true
  },
  actions: [{
    type: String,
    enum: ['create', 'read', 'update', 'delete', 'assign', 'export', 'import', 'manage']
  }]
}, { _id: false });

const roleSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  permissions: [permissionSchema],
  isSystem: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

const Role = mongoose.model('Role', roleSchema);

export default Role;
