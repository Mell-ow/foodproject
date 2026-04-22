const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('./models/MenuItem');
const connectDB = require('./config/db');

dotenv.config();

const seedMenu = async () => {
  await connectDB();

  const items = [
    // Chicken Variants
    {
      name: 'Crispy Fried Chicken',
      description: 'Golden, crunchy, and juicy fried chicken pieces with special seasoning.',
      category: 'Chicken',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cb6ac0?q=80&w=600&auto=format&fit=crop',
      isVeg: false,
      spiceLevel: 2,
    },
    {
      name: 'Chicken Lolipop',
      description: 'Frenched chicken winglet, marinated and deep-fried to perfection.',
      category: 'Chicken',
      price: 10.99,
      image: 'https://images.unsplash.com/photo-1569698134101-f16c06a5133e?q=80&w=600&auto=format&fit=crop',
      isVeg: false,
      spiceLevel: 3,
    },
    {
      name: 'Chicken Popcorn',
      description: 'Bite-sized tender crispy chicken pieces, perfect for snacking.',
      category: 'Chicken',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1562967914-01efa7e87832?q=80&w=600&auto=format&fit=crop',
      isVeg: false,
      spiceLevel: 1,
    },
    {
      name: 'Glazed Chicken Wings',
      description: 'Succulent wings tossed in our signature smoky BBQ sauce.',
      category: 'Chicken',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?q=80&w=600&auto=format&fit=crop',
      isVeg: false,
      spiceLevel: 2,
    },
    {
      name: 'Chicken Strips',
      description: 'Boneless chicken tenders fried crisp, served with garlic mayo.',
      category: 'Chicken',
      price: 9.99,
      image: 'https://images.unsplash.com/photo-1562967915-92ae0c5d2c64?q=80&w=600&auto=format&fit=crop',
      isVeg: false,
      spiceLevel: 1,
    },
    {
      name: 'Roasted Chicken Thigh',
      description: 'Oven-roasted tender chicken thigh with aromatic herbs.',
      category: 'Chicken',
      price: 11.99,
      image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=600&auto=format&fit=crop',
      isVeg: false,
      spiceLevel: 1,
    },

    // Burgers
    {
      name: 'Splash Chicken Burger',
      description: 'Crispy chicken patty with splash sauce, lettuce, and cheese.',
      category: 'Burgers',
      price: 13.99,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop',
      isVeg: false,
      spiceLevel: 2,
    },
    {
      name: 'Classic Smash Burger',
      description: 'Double beef patty smashed with caramelized onions and cheddar.',
      category: 'Burgers',
      price: 15.99,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600&auto=format&fit=crop',
      isVeg: false,
      spiceLevel: 1,
    },

    // Pizzas
    {
      name: 'Margherita Pizza',
      description: 'Wood-fired crust with san marzano tomatoes and fresh mozzarella.',
      category: 'Pizza',
      price: 16.99,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop',
      isVeg: true,
      spiceLevel: 1,
    },
    {
      name: 'Spicy Pepperoni Pizza',
      description: 'Loaded with premium pepperoni and extra mozzarella.',
      category: 'Pizza',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=600&auto=format&fit=crop',
      isVeg: false,
      spiceLevel: 3,
    },

    // Extras / Others
    {
      name: 'Garlic Butter Fries',
      description: 'Crispy fries tossed in garlic herb butter.',
      category: 'Sides',
      price: 6.99,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080e1424aa?q=80&w=600&auto=format&fit=crop',
      isVeg: true,
      spiceLevel: 1,
    },
    {
      name: 'Iced Caramel Latte',
      description: 'Espresso blended with cold milk and rich caramel syrup.',
      category: 'Beverages',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop',
      isVeg: true,
      spiceLevel: 1,
    }
  ];

  try {
    await MenuItem.deleteMany(); // Clear existing
    await MenuItem.insertMany(items);
    console.log('Database seeded with complete menu items!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedMenu();
