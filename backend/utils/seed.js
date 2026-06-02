import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Category from '../models/Category.js';
import MenuItem from '../models/MenuItem.js';
import Table from '../models/Table.js';
import Customer from '../models/Customer.js';
import Inventory from '../models/Inventory.js';
import Supplier from '../models/Supplier.js';
import Order from '../models/Order.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      MenuItem.deleteMany({}),
      Table.deleteMany({}),
      Customer.deleteMany({}),
      Inventory.deleteMany({}),
      Supplier.deleteMany({}),
      Order.deleteMany({})
    ]);

    // Create users
    const users = await User.create([
      { name: 'Admin User', email: 'admin@bistrobee.com', password: 'admin123', role: 'admin' },
      { name: 'John Manager', email: 'manager@bistrobee.com', password: 'manager123', role: 'manager' },
      { name: 'Sara Cashier', email: 'cashier@bistrobee.com', password: 'cashier123', role: 'cashier' },
      { name: 'Mike Kitchen', email: 'kitchen@bistrobee.com', password: 'kitchen123', role: 'kitchen' }
    ]);

    // Create categories
    const categories = await Category.create([
      { name: 'Starters', description: 'Appetizers and small bites', sortOrder: 1 },
      { name: 'Main Course', description: 'Hearty main dishes', sortOrder: 2 },
      { name: 'Beverages', description: 'Cold and hot drinks', sortOrder: 3 },
      { name: 'Desserts', description: 'Sweet endings', sortOrder: 4 },
      { name: 'Pizza', description: 'Wood-fired pizzas', sortOrder: 5 },
      { name: 'Burgers', description: 'Gourmet burgers', sortOrder: 6 }
    ]);

    const [starters, mainCourse, beverages, desserts, pizza, burgers] = categories;

    // Create suppliers
    const suppliers = await Supplier.create([
      { name: 'Fresh Farms Co.', contact: '9876543210', email: 'freshfarms@example.com', itemsSupplied: ['Vegetables', 'Dairy'], rating: 4 },
      { name: 'Meat Masters', contact: '9876543211', email: 'meatmasters@example.com', itemsSupplied: ['Chicken', 'Beef', 'Pork'], rating: 5 },
      { name: 'Grain & More', contact: '9876543212', email: 'grain@example.com', itemsSupplied: ['Flour', 'Rice', 'Bread'], rating: 4 }
    ]);

    // Create inventory
    const inventory = await Inventory.create([
      { name: 'Chicken', category: 'Meat', currentStock: 50, unit: 'kg', minStockLevel: 10, costPerUnit: 200, supplier: suppliers[1]._id },
      { name: 'Flour', category: 'Grains', currentStock: 30, unit: 'kg', minStockLevel: 10, costPerUnit: 50, supplier: suppliers[2]._id },
      { name: 'Tomatoes', category: 'Vegetables', currentStock: 8, unit: 'kg', minStockLevel: 10, costPerUnit: 40, supplier: suppliers[0]._id },
      { name: 'Cheese', category: 'Dairy', currentStock: 15, unit: 'kg', minStockLevel: 5, costPerUnit: 300, supplier: suppliers[0]._id },
      { name: 'Lettuce', category: 'Vegetables', currentStock: 5, unit: 'kg', minStockLevel: 8, costPerUnit: 30, supplier: suppliers[0]._id },
      { name: 'Beef Patty', category: 'Meat', currentStock: 40, unit: 'pcs', minStockLevel: 20, costPerUnit: 100, supplier: suppliers[1]._id }
    ]);

    // Create menu items
    const menuItems = await MenuItem.create([
      { name: 'Chicken Wings', description: 'Crispy buffalo chicken wings with dipping sauce', category: starters._id, price: 320, preparationTime: 15, isVeg: false, spiceLevel: 'medium', popularity: 95 },
      { name: 'Veg Sampler', description: 'Assorted vegetarian appetizers platter', category: starters._id, price: 280, preparationTime: 10, isVeg: true, popularity: 82 },
      { name: 'Garlic Bread', description: 'Toasted bread with garlic butter and herbs', category: starters._id, price: 150, preparationTime: 8, isVeg: true, popularity: 88 },
      { name: 'Grilled Chicken', description: 'Herb-marinated grilled chicken with veggies', category: mainCourse._id, price: 480, preparationTime: 20, isVeg: false, popularity: 92 },
      { name: 'Paneer Butter Masala', description: 'Rich creamy paneer curry', category: mainCourse._id, price: 380, preparationTime: 18, isVeg: true, popularity: 96 },
      { name: 'Pasta Arrabiata', description: 'Spicy tomato pasta with fresh herbs', category: mainCourse._id, price: 350, preparationTime: 15, isVeg: true, popularity: 78 },
      { name: 'Margherita Pizza', description: 'Classic tomato sauce with fresh mozzarella', category: pizza._id, price: 420, preparationTime: 20, isVeg: true, popularity: 90, variants: [{ name: 'Regular (10")', price: 420 }, { name: 'Large (14")', price: 580 }] },
      { name: 'BBQ Chicken Pizza', description: 'Smoky BBQ sauce with grilled chicken', category: pizza._id, price: 520, preparationTime: 22, isVeg: false, popularity: 88 },
      { name: 'Classic Burger', description: 'Beef patty with lettuce, tomato, cheese', category: burgers._id, price: 340, preparationTime: 12, isVeg: false, popularity: 94, ingredients: [{ item: inventory[5]._id, quantity: 1, unit: 'pcs' }, { item: inventory[3]._id, quantity: 0.05, unit: 'kg' }] },
      { name: 'Veg Burger', description: 'Crispy veggie patty with fresh toppings', category: burgers._id, price: 280, preparationTime: 10, isVeg: true, popularity: 72 },
      { name: 'Coca Cola', description: 'Chilled classic Coke 330ml', category: beverages._id, price: 80, preparationTime: 2, isVeg: true, popularity: 85 },
      { name: 'Fresh Lime Soda', description: 'Refreshing lime soda with mint', category: beverages._id, price: 90, preparationTime: 3, isVeg: true, popularity: 80 },
      { name: 'Mango Lassi', description: 'Thick creamy mango yogurt drink', category: beverages._id, price: 120, preparationTime: 5, isVeg: true, popularity: 91 },
      { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', category: desserts._id, price: 220, preparationTime: 15, isVeg: true, popularity: 97 },
      { name: 'Gulab Jamun', description: 'Soft khoya dumplings in sugar syrup', category: desserts._id, price: 160, preparationTime: 5, isVeg: true, popularity: 89 }
    ]);

    // Create tables
    const tables = await Table.create([
      { tableNumber: 'T1', capacity: 2, status: 'available', position: { x: 100, y: 100 } },
      { tableNumber: 'T2', capacity: 4, status: 'occupied', position: { x: 250, y: 100 } },
      { tableNumber: 'T3', capacity: 4, status: 'available', position: { x: 400, y: 100 } },
      { tableNumber: 'T4', capacity: 6, status: 'reserved', position: { x: 100, y: 250 } },
      { tableNumber: 'T5', capacity: 6, status: 'available', position: { x: 250, y: 250 } },
      { tableNumber: 'T6', capacity: 8, status: 'billing', position: { x: 400, y: 250 } },
      { tableNumber: 'T7', capacity: 2, status: 'available', position: { x: 100, y: 400 } },
      { tableNumber: 'T8', capacity: 4, status: 'available', position: { x: 250, y: 400 } },
      { tableNumber: 'T9', capacity: 4, status: 'occupied', position: { x: 400, y: 400 } },
      { tableNumber: 'T10', capacity: 10, status: 'available', position: { x: 250, y: 550 } }
    ]);

    // Create customers
    const customers = await Customer.create([
      { name: 'Priya Sharma', email: 'priya@example.com', phone: '9876541001', loyaltyPoints: 580, membershipTier: 'gold', totalOrders: 32, totalSpent: 18400 },
      { name: 'Rahul Gupta', email: 'rahul@example.com', phone: '9876541002', loyaltyPoints: 220, membershipTier: 'silver', totalOrders: 14, totalSpent: 7200 },
      { name: 'Meera Patel', email: 'meera@example.com', phone: '9876541003', loyaltyPoints: 1200, membershipTier: 'platinum', totalOrders: 68, totalSpent: 45000 },
      { name: 'Arjun Singh', email: 'arjun@example.com', phone: '9876541004', loyaltyPoints: 80, membershipTier: 'bronze', totalOrders: 5, totalSpent: 2100 },
      { name: 'Divya Nair', email: 'divya@example.com', phone: '9876541005', loyaltyPoints: 340, membershipTier: 'silver', totalOrders: 22, totalSpent: 11500 }
    ]);

    // Create sample orders
    const now = new Date();
    const orders = [];
    const statuses = ['completed', 'completed', 'completed', 'preparing', 'placed'];
    for (let i = 0; i < 15; i++) {
      const orderItems = [
        { menuItem: menuItems[Math.floor(Math.random() * menuItems.length)]._id, name: menuItems[0].name, quantity: Math.floor(Math.random() * 3) + 1, price: menuItems[0].price, status: 'served' },
        { menuItem: menuItems[Math.floor(Math.random() * menuItems.length)]._id, name: menuItems[1].name, quantity: 1, price: menuItems[1].price, status: 'served' }
      ];
      const subtotal = orderItems.reduce((s, x) => s + x.price * x.quantity, 0);
      const tax = Math.round(subtotal * 0.05);
      const total = subtotal + tax;
      const date = new Date(now - i * 60 * 60 * 1000);
      orders.push({
        orderNumber: `ORD${Date.now()}${i}`,
        orderType: ['dine-in', 'takeaway', 'delivery'][i % 3],
        table: i % 3 === 0 ? tables[i % tables.length]._id : undefined,
        customer: customers[i % customers.length]._id,
        items: orderItems,
        subtotal,
        tax,
        discount: 0,
        total,
        paymentMethod: ['cash', 'card', 'upi'][i % 3],
        paymentStatus: i < 12 ? 'paid' : 'pending',
        status: statuses[i % statuses.length],
        createdBy: users[0]._id,
        createdAt: date
      });
    }

    await Order.create(orders);

    console.log('✅ Seed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@bistrobee.com / admin123');
    console.log('Manager: manager@bistrobee.com / manager123');
    console.log('Cashier: cashier@bistrobee.com / cashier123');
    console.log('Kitchen: kitchen@bistrobee.com / kitchen123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
