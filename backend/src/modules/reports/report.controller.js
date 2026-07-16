import Lead from '../leads/lead.model.js';
import Deal from '../deals/deal.model.js';
import Customer from '../customers/customer.model.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const qualifiedLeads = await Lead.countDocuments({ status: 'Qualified' });
    const totalCustomers = await Customer.countDocuments();
    
    const wonDeals = await Deal.find({ stage: 'Won' });
    const totalRevenue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);

    const conversionRate = totalLeads === 0 ? 0 : ((wonDeals.length / totalLeads) * 100).toFixed(2);

    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        qualifiedLeads,
        totalCustomers,
        totalRevenue,
        conversionRate
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getRevenueReport = async (req, res, next) => {
  try {
    // Aggregate revenue by month (simplified for now)
    const pipeline = [
      { $match: { stage: 'Won' } },
      { 
        $group: { 
          _id: { $month: "$updatedAt" }, 
          revenue: { $sum: "$value" } 
        } 
      },
      { $sort: { "_id": 1 } }
    ];

    const data = await Deal.aggregate(pipeline);
    
    // Map to month names
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedData = data.map(d => ({
      name: months[d._id - 1],
      revenue: d.revenue
    }));

    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    next(error);
  }
};
