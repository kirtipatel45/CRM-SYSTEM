import AuditLog from './audit.model.js';

/**
 * Utility function to create an audit log entry from anywhere in the codebase
 */
export const logAuditAction = async (action, resource, performedBy, details = {}, resourceId = null, ipAddress = null) => {
  try {
    await AuditLog.create({
      action,
      resource,
      resourceId,
      performedBy,
      details,
      ipAddress
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
};

/**
 * Controller to fetch audit logs with pagination and filters
 * Protected route: Only Admins should access this
 */
export const getAuditLogs = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      resource,
      action,
      startDate,
      endDate
    } = req.query;

    const query = {};

    if (resource) query.resource = resource;
    if (action) query.action = { $regex: action, $options: 'i' };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await AuditLog.find(query)
      .populate('performedBy', 'firstName lastName email name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AuditLog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};
