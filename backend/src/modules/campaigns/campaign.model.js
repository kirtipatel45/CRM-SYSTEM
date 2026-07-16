import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['Email', 'WhatsApp', 'SMS', 'Social Media', 'Webinar', 'Other'],
    default: 'Email'
  },
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Completed', 'Paused'],
    default: 'Draft'
  },
  startDate: { type: Date },
  endDate: { type: Date },
  budget: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
  metrics: {
    sent: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 },
    converted: { type: Number, default: 0 }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  description: String
}, {
  timestamps: true
});

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;
