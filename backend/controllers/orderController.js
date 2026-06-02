import Order from '../models/Order.js';
import Table from '../models/Table.js';
import MenuItem from '../models/MenuItem.js';
import Inventory from '../models/Inventory.js';

export const createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      createdBy: req.user._id
    });

    if (order.table) {
      await Table.findByIdAndUpdate(order.table, { 
        status: 'occupied',
        currentOrder: order._id 
      });
    }

    // Deduct inventory
    for (const item of order.items) {
      const menuItem = await MenuItem.findById(item.menuItem).populate('ingredients.item');
      for (const ingredient of menuItem.ingredients || []) {
        if (ingredient.item) {
          await Inventory.findByIdAndUpdate(ingredient.item._id, {
            $inc: { currentStock: -(ingredient.quantity * item.quantity) }
          });
        }
      }
    }

    const populatedOrder = await Order.findById(order._id)
      .populate('table')
      .populate('items.menuItem')
      .populate('customer');

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { status, orderType, startDate, endDate } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (orderType) query.orderType = orderType;
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const orders = await Order.find(query)
      .populate('table')
      .populate('customer')
      .populate('items.menuItem')
      .sort('-createdAt');
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('table')
      .populate('customer')
      .populate('items.menuItem');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (req.body.status === 'completed' && order.table) {
      await Table.findByIdAndUpdate(order.table, { 
        status: 'available',
        currentOrder: null 
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderItemStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    const item = order.items.id(itemId);
    item.status = status;
    
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
