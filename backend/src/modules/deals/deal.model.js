import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  value: { type: Number, required: true, default: 0 },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  stage: {
    type: String,
    enum: ['Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost'],
    default: 'Discovery'
  },
  expectedCloseDate: { type: Date },
  probability: { type: Number, min: 0, max: 100, default: 50 },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

const Deal = mongoose.model('Deal', dealSchema);

export default Deal;
