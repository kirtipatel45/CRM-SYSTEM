import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    resource: {
      type: String,
      required: true,
      enum: ['Leads', 'Customers', 'Deals', 'Users', 'Roles', 'Settings', 'Auth', 'Other'],
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    details: {
      type: Object,
      default: {},
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying (admins will likely filter by resource, user, or date)
auditLogSchema.index({ resource: 1 });
auditLogSchema.index({ performedBy: 1 });
auditLogSchema.index({ createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
