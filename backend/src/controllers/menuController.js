const MenuItem = require('../models/MenuItem');
const asyncHandler = require('../utils/asyncHandler');

// Real Zan Cafe Karaikal menu with ₹ prices (used as fallback when DB is empty)
const ZAN_MENU = [
  // BURGERS
  { _id: 'b1',  name: 'Kids Burger',                category: 'Burger',        price: 60,  isVeg: true,  isAvailable: true, description: 'A perfect little burger for kids', spiceLevel: 1 },
  { _id: 'b2',  name: 'Veg Classic Burger',          category: 'Burger',        price: 70,  isVeg: true,  isAvailable: true, description: 'Classic veggie patty with fresh veggies', spiceLevel: 1 },
  { _id: 'b3',  name: 'Cheese Corn Burger',          category: 'Burger',        price: 80,  isVeg: true,  isAvailable: true, description: 'Crunchy corn with melted cheese', spiceLevel: 1 },
  { _id: 'b4',  name: 'Loaded Paneer Burger',        category: 'Burger',        price: 100, isVeg: true,  isAvailable: true, description: 'Loaded with spiced paneer filling', spiceLevel: 2 },
  { _id: 'b5',  name: 'Tikka Burger',                category: 'Burger',        price: 100, isVeg: true,  isAvailable: true, description: 'Tikka spiced patty in a toasted bun', spiceLevel: 2 },
  { _id: 'b6',  name: 'Fried Paneer Masala Burger',  category: 'Burger',        price: 120, isVeg: true,  isAvailable: true, description: 'Crispy fried paneer with masala sauce', spiceLevel: 2 },
  { _id: 'b7',  name: 'Veg Tower Cheese Burger',     category: 'Burger',        price: 140, isVeg: true,  isAvailable: true, description: 'Double-stacked veg tower with extra cheese', spiceLevel: 1 },
  { _id: 'b8',  name: 'ZAN Special Burger',          category: 'Burger',        price: 150, isVeg: true,  isAvailable: true, description: "Zan Cafe's signature special veg burger", spiceLevel: 2, isBestSeller: true },
  { _id: 'b9',  name: 'BBQ Chicken Burger',          category: 'Burger',        price: 100, isVeg: false, isAvailable: true, description: 'Juicy BBQ chicken with smoky sauce', spiceLevel: 2 },
  { _id: 'b10', name: 'BBQ Chicken Cheese Burger',   category: 'Burger',        price: 120, isVeg: false, isAvailable: true, description: 'BBQ chicken with extra cheese', spiceLevel: 2 },
  { _id: 'b11', name: 'Crispy Chicken Burger',       category: 'Burger',        price: 120, isVeg: false, isAvailable: true, description: 'Extra crispy fried chicken burger', spiceLevel: 2 },
  { _id: 'b12', name: 'Fried Chicken Burger',        category: 'Burger',        price: 130, isVeg: false, isAvailable: true, description: 'Southern style fried chicken', spiceLevel: 2 },
  { _id: 'b13', name: 'Loaded Chicken Burger',       category: 'Burger',        price: 140, isVeg: false, isAvailable: true, description: 'Loaded with chicken, sauce and toppings', spiceLevel: 2 },
  { _id: 'b14', name: 'Chicken Tower Burger',        category: 'Burger',        price: 160, isVeg: false, isAvailable: true, description: 'Double stacked chicken tower', spiceLevel: 2 },
  { _id: 'b15', name: 'Boneless Chicken Burger',     category: 'Burger',        price: 180, isVeg: false, isAvailable: true, description: 'Premium boneless chicken fillet', spiceLevel: 2 },
  { _id: 'b16', name: 'ZAN Special Chicken Burger',  category: 'Burger',        price: 180, isVeg: false, isAvailable: true, description: "Zan Cafe's signature chicken burger", spiceLevel: 3, isBestSeller: true },
  // PIZZA
  { _id: 'p1',  name: 'Veg Pizza',                  category: 'Pizza',         price: 120, isVeg: true,  isAvailable: true, description: 'Classic veggie pizza with bell peppers and onions', spiceLevel: 1 },
  { _id: 'p2',  name: 'Double Cheese Pizza',         category: 'Pizza',         price: 130, isVeg: true,  isAvailable: true, description: 'Extra double cheese loaded pizza', spiceLevel: 1, isBestSeller: true },
  { _id: 'p3',  name: 'Veg Sweet Corn Pizza',        category: 'Pizza',         price: 130, isVeg: true,  isAvailable: true, description: 'Sweet corn with mozzarella on a crispy base', spiceLevel: 1 },
  // FALOODA
  { _id: 'f1',  name: 'Royal Falooda',               category: 'Falooda',       price: 100, isVeg: true,  isAvailable: true, description: 'Classic royal falooda with rose syrup', spiceLevel: 1 },
  { _id: 'f2',  name: 'Pan Falooda',                 category: 'Falooda',       price: 100, isVeg: true,  isAvailable: true, description: 'Paan-flavoured falooda delight', spiceLevel: 1 },
  { _id: 'f3',  name: 'Kulfi Falooda',               category: 'Falooda',       price: 130, isVeg: true,  isAvailable: true, description: 'Creamy kulfi topped falooda', spiceLevel: 1, isBestSeller: true },
  { _id: 'f4',  name: 'Dry Fruit Falooda',           category: 'Falooda',       price: 130, isVeg: true,  isAvailable: true, description: 'Premium dry fruit topped falooda', spiceLevel: 1 },
  { _id: 'f5',  name: 'Mixed Ice Cream Falooda',     category: 'Falooda',       price: 150, isVeg: true,  isAvailable: true, description: 'Falooda with multiple ice cream flavours', spiceLevel: 1 },
  // ICE CREAM
  { _id: 'i1',  name: 'Vanilla',                     category: 'Ice Cream',     price: 40,  isVeg: true,  isAvailable: true, description: 'Classic creamy vanilla scoop', spiceLevel: 1 },
  { _id: 'i2',  name: 'Strawberry',                  category: 'Ice Cream',     price: 50,  isVeg: true,  isAvailable: true, description: 'Fresh strawberry ice cream', spiceLevel: 1 },
  { _id: 'i3',  name: 'Chocolate',                   category: 'Ice Cream',     price: 50,  isVeg: true,  isAvailable: true, description: 'Rich dark chocolate ice cream', spiceLevel: 1 },
  { _id: 'i4',  name: 'Mango',                       category: 'Ice Cream',     price: 50,  isVeg: true,  isAvailable: true, description: 'Alphonso mango flavoured ice cream', spiceLevel: 1 },
  { _id: 'i5',  name: 'Pista',                       category: 'Ice Cream',     price: 60,  isVeg: true,  isAvailable: true, description: 'Pistachio ice cream', spiceLevel: 1 },
  { _id: 'i6',  name: 'Butterscotch',                category: 'Ice Cream',     price: 60,  isVeg: true,  isAvailable: true, description: 'Smooth butterscotch ice cream', spiceLevel: 1 },
  { _id: 'i7',  name: 'Blackcurrant',                category: 'Ice Cream',     price: 60,  isVeg: true,  isAvailable: true, description: 'Tangy blackcurrant ice cream', spiceLevel: 1 },
  { _id: 'i8',  name: 'Mixed Ice Cream',             category: 'Ice Cream',     price: 90,  isVeg: true,  isAvailable: true, description: 'A mix of three flavours', spiceLevel: 1 },
  // CAKE & BROWNIE
  { _id: 'c1',  name: 'Lava Cake',                   category: 'Cake & Brownie',price: 90,  isVeg: true,  isAvailable: true, description: 'Warm chocolate lava cake', spiceLevel: 1 },
  { _id: 'c2',  name: 'Lava Cake with Ice Cream',    category: 'Cake & Brownie',price: 120, isVeg: true,  isAvailable: true, description: 'Lava cake served with vanilla ice cream', spiceLevel: 1 },
  { _id: 'br1', name: 'Brownie With Ice Cream',      category: 'Cake & Brownie',price: 100, isVeg: true,  isAvailable: true, description: 'Fudgy brownie topped with ice cream', spiceLevel: 1 },
  { _id: 'br2', name: 'Brownie With Kulfi',          category: 'Cake & Brownie',price: 120, isVeg: true,  isAvailable: true, description: 'Brownie served with creamy kulfi', spiceLevel: 1 },
  { _id: 'br3', name: 'Sizzler Brownie',             category: 'Cake & Brownie',price: 140, isVeg: true,  isAvailable: true, description: 'Hot sizzling brownie dessert', spiceLevel: 1, isBestSeller: true },
  // SANDWICH
  { _id: 's1',  name: 'Veg Sandwich',                category: 'Sandwich',      price: 80,  isVeg: true,  isAvailable: true, description: 'Fresh veggie sandwich', spiceLevel: 1 },
  { _id: 's2',  name: 'Club Sandwich',               category: 'Sandwich',      price: 120, isVeg: true,  isAvailable: true, description: 'Triple-decker club sandwich', spiceLevel: 1 },
  { _id: 's3',  name: 'Chicken Sandwich',            category: 'Sandwich',      price: 130, isVeg: false, isAvailable: true, description: 'Grilled chicken sandwich', spiceLevel: 2 },
  // PASTA & MOMOS
  { _id: 'pm1', name: 'White Sauce Pasta',           category: 'Pasta & Momos', price: 150, isVeg: true,  isAvailable: true, description: 'Creamy white sauce pasta', spiceLevel: 1 },
  { _id: 'pm2', name: 'Red Sauce Pasta',             category: 'Pasta & Momos', price: 140, isVeg: true,  isAvailable: true, description: 'Tangy tomato red sauce pasta', spiceLevel: 2 },
  { _id: 'pm3', name: 'Veg Steamed Momos',           category: 'Pasta & Momos', price: 80,  isVeg: true,  isAvailable: true, description: 'Soft steamed vegetable momos', spiceLevel: 1 },
  { _id: 'pm4', name: 'Chicken Fried Momos',         category: 'Pasta & Momos', price: 100, isVeg: false, isAvailable: true, description: 'Crispy fried chicken momos', spiceLevel: 2 },
  // BBQ
  { _id: 'bbq1',name: 'BBQ Chicken Wings',           category: 'BBQ',           price: 180, isVeg: false, isAvailable: true, description: 'Smoky BBQ glazed chicken wings', spiceLevel: 2 },
  { _id: 'bbq2',name: 'Grilled BBQ Chicken',         category: 'BBQ',           price: 250, isVeg: false, isAvailable: true, description: 'Full grilled BBQ chicken', spiceLevel: 2 },
  // MAGGI & ROLLS
  { _id: 'mr1', name: 'Veg Maggi',                   category: 'Maggi & Rolls', price: 50,  isVeg: true,  isAvailable: true, description: 'Masala maggi noodles', spiceLevel: 2 },
  { _id: 'mr2', name: 'Egg Maggi',                   category: 'Maggi & Rolls', price: 70,  isVeg: false, isAvailable: true, description: 'Maggi with scrambled egg', spiceLevel: 2 },
  { _id: 'mr3', name: 'Chicken Roll',                category: 'Maggi & Rolls', price: 90,  isVeg: false, isAvailable: true, description: 'Spiced chicken wrapped in a paratha roll', spiceLevel: 2 },
  { _id: 'mr4', name: 'Paneer Roll',                 category: 'Maggi & Rolls', price: 80,  isVeg: true,  isAvailable: true, description: 'Spiced paneer wrapped in a paratha roll', spiceLevel: 2 },
];

// @desc  Get all menu items
// @route GET /api/menu
exports.getAllMenuItems = asyncHandler(async (req, res) => {
  try {
    const items = await MenuItem.find({ isAvailable: true });
    res.status(200).json(items.length > 0 ? items : ZAN_MENU);
  } catch (err) {
    res.status(200).json(ZAN_MENU);
  }
});

// @desc  Get single menu item
// @route GET /api/menu/:id
exports.getMenuItem = asyncHandler(async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (item) return res.status(200).json(item);
  } catch (_) {}
  const fallback = ZAN_MENU.find((i) => i._id === req.params.id);
  if (!fallback) return res.status(404).json({ message: 'Item not found' });
  res.status(200).json(fallback);
});
