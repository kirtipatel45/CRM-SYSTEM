import Lead from './lead.model.js';

export const getLeads = async (req, res, next) => {
  try {
    const { status, source, priority, owner, search, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const query = {};
    if (status) query.status = status;
    if (source) query.source = source;
    if (priority) query.priority = priority;
    if (owner) query.owner = owner;
    
    // Search by name, email or company
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const leads = await Lead.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Lead.countDocuments(query);

    res.status(200).json({ 
      success: true, 
      count: leads.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: leads 
    });
  } catch (error) {
    next(error);
  }
};

export const getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('notes.author', 'name')
      .populate('timeline.performedBy', 'name');

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (req, res, next) => {
  try {
    // Add initial timeline event
    req.body.timeline = [{
      action: 'Created',
      description: 'Lead was created',
      performedBy: req.user._id
    }];

    const lead = await Lead.create(req.body);
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Check if status changed to log it
    if (req.body.status && req.body.status !== lead.status) {
      req.body.$push = {
        timeline: {
          action: 'Status Changed',
          description: `Status changed from ${lead.status} to ${req.body.status}`,
          performedBy: req.user._id
        }
      };
    }

    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('owner', 'name email');

    res.status(200).json({ success: true, data: updatedLead });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    await lead.deleteOne();
    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Notes logic
export const addLeadNote = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    lead.notes.push({
      text: req.body.text,
      author: req.user._id
    });
    
    lead.timeline.push({
      action: 'Note Added',
      description: 'Added a new note',
      performedBy: req.user._id
    });

    await lead.save();
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};
