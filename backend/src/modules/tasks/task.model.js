import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  dueDate: { type: Date },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  relatedTo: {
    model: { type: String, enum: ['Lead', 'Customer', 'Deal'] },
    id: { type: mongoose.Schema.Types.ObjectId }
  }
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
