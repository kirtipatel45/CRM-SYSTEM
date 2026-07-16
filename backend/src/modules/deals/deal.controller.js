import Deal from './deal.model.js';

export const getDeals = async (req, res, next) => {
  try {
    const { stage, owner, customer, search, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (stage) query.stage = stage;
    if (owner) query.owner = owner;
    if (customer) query.customer = customer;
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const deals = await Deal.find(query)
      .populate('owner', 'name email')
      .populate('customer', 'company contactPerson')
      .sort({ expectedCloseDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Deal.countDocuments(query);

    res.status(200).json({ 
      success: true, 
      count: deals.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: deals 
    });
  } catch (error) {
    next(error);
  }
};

export const getDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('customer', 'company contactPerson email phone')
      .populate('notes.author', 'name');

    if (!deal) {
      return res.status(404).json({ success: false, message: 'Deal not found' });
    }

    res.status(200).json({ success: true, data: deal });
  } catch (error) {
    next(error);
  }
};

export const createDeal = async (req, res, next) => {
  try {
    const deal = await Deal.create(req.body);
    res.status(201).json({ success: true, data: deal });
  } catch (error) {
    next(error);
  }
};

export const updateDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('owner', 'name email').populate('customer', 'company contactPerson');

    if (!deal) {
      return res.status(404).json({ success: false, message: 'Deal not found' });
    }

    res.status(200).json({ success: true, data: deal });
  } catch (error) {
    next(error);
  }
};

export const deleteDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ success: false, message: 'Deal not found' });
    }

    await deal.deleteOne();
    res.status(200).json({ success: true, message: 'Deal deleted successfully' });
  } catch (error) {
    next(error);
  }
};
