import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const timelineSchema = new mongoose.Schema({
  action: { type: String, required: true },
  description: String,
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now }
});

const leadSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  company: { type: String, trim: true },
  jobTitle: { type: String, trim: true },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'],
    default: 'New'
  },
  source: {
    type: String,
    enum: ['Website', 'Facebook', 'Instagram', 'LinkedIn', 'Google', 'Referral', 'Email', 'WhatsApp', 'Other'],
    default: 'Website'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  value: { type: Number, default: 0 },
  nextFollowUp: { type: Date },
  notes: [noteSchema],
  timeline: [timelineSchema]
}, {
  timestamps: true
});

// Middleware to log status changes in timeline
leadSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  if (update.status) {
    // If status is being updated, we can push to timeline but it's tricky in pre('findOneAndUpdate')
    // A better approach is to handle timeline logic in the controller for complex actions.
  }
  next();
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
