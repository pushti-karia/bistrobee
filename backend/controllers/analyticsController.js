import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import Customer from '../models/Customer.js';

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const todayRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: today }, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const totalOrders = await Order.countDocuments();
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });

    const popularItems = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { 
        _id: '$items.menuItem',
        count: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
      }},
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: {
        from: 'menuitems',
        localField: '_id',
        foreignField: '_id',
        as: 'item'
      }},
      { $unwind: '$item' }
    ]);

    const revenueByDay = await Order.aggregate([
      { $match: { 
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        paymentStatus: 'paid'
      }},
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      todayRevenue: todayRevenue[0]?.total || 0,
      totalOrders,
      todayOrders,
      popularItems,
      revenueByDay
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const orders = await Order.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
      paymentStatus: 'paid'
    }).populate('items.menuItem');

    const summary = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      totalTax: orders.reduce((sum, order) => sum + order.tax, 0),
      totalDiscount: orders.reduce((sum, order) => sum + order.discount, 0)
    };

    res.json({ orders, summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
