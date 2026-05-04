import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Coupon from './models/Coupon.js';
import Review from './models/Review.js';
import Order from './models/Order.js';

dotenv.config();

const products = [
  // CAKES
  {
    name: 'Belgian Chocolate Truffle Cake',
    description: 'A rich, indulgent chocolate cake layered with velvety Belgian chocolate truffle cream. Made with premium cocoa and finished with chocolate ganache.',
    price: 899,
    discountPrice: 799,
    category: 'cakes',
    images: ['/images/cake.png'],
    stock: 25,
    isVeg: true,
    isEggless: false,
    weight: '1 kg',
    servings: '8-10',
    ingredients: 'Belgian chocolate, butter, cream, flour, sugar, eggs, cocoa powder',
    isFeatured: true,
    isBestseller: true,
    tags: ['chocolate', 'truffle', 'premium', 'birthday'],
  },
  {
    name: 'Red Velvet Dream Cake',
    description: 'Classic red velvet cake with layers of cream cheese frosting. A perfect blend of mild cocoa and tangy cream cheese.',
    price: 849,
    discountPrice: 0,
    category: 'cakes',
    images: ['/images/cake.png'],
    stock: 20,
    isVeg: true,
    isEggless: false,
    weight: '1 kg',
    servings: '8-10',
    ingredients: 'Flour, cocoa, buttermilk, cream cheese, butter, sugar, red food color',
    isFeatured: true,
    isBestseller: false,
    tags: ['red velvet', 'cream cheese', 'classic'],
  },
  {
    name: 'Vanilla Bean Cheesecake',
    description: 'New York style cheesecake made with real vanilla bean pods. Creamy, rich, and absolutely divine with a buttery biscuit base.',
    price: 749,
    discountPrice: 699,
    category: 'cakes',
    images: ['/images/cake.png'],
    stock: 15,
    isVeg: true,
    isEggless: true,
    weight: '750g',
    servings: '6-8',
    ingredients: 'Cream cheese, vanilla bean, butter, biscuits, sugar, cream',
    isFeatured: false,
    isBestseller: true,
    tags: ['cheesecake', 'vanilla', 'eggless'],
  },
  {
    name: 'Butterscotch Bliss Cake',
    description: 'Moist butterscotch sponge layered with caramel cream and topped with crunchy butterscotch praline pieces.',
    price: 699,
    discountPrice: 0,
    category: 'cakes',
    images: ['/images/cake.png'],
    stock: 18,
    isVeg: true,
    isEggless: true,
    weight: '1 kg',
    servings: '8-10',
    ingredients: 'Flour, butterscotch essence, caramel, cream, sugar, praline',
    isFeatured: false,
    isBestseller: false,
    tags: ['butterscotch', 'caramel', 'eggless'],
  },

  // BROWNIES
  {
    name: 'Dark Chocolate Walnut Brownie',
    description: 'Fudgy, gooey dark chocolate brownie loaded with crunchy California walnuts. The perfect balance of rich and nutty.',
    price: 299,
    discountPrice: 249,
    category: 'brownies',
    images: ['/images/brownie.png'],
    stock: 50,
    isVeg: true,
    isEggless: false,
    weight: '250g',
    servings: '4',
    ingredients: 'Dark chocolate, butter, walnuts, flour, sugar, eggs, vanilla',
    isFeatured: true,
    isBestseller: true,
    tags: ['chocolate', 'walnut', 'fudgy', 'bestseller'],
  },
  {
    name: 'Salted Caramel Brownie',
    description: 'Rich chocolate brownie drizzled with homemade salted caramel sauce and finished with a sprinkle of sea salt flakes.',
    price: 329,
    discountPrice: 0,
    category: 'brownies',
    images: ['/images/brownie.png'],
    stock: 40,
    isVeg: true,
    isEggless: false,
    weight: '250g',
    servings: '4',
    ingredients: 'Dark chocolate, butter, caramel, sea salt, flour, sugar, eggs',
    isFeatured: true,
    isBestseller: false,
    tags: ['caramel', 'salted', 'premium'],
  },
  {
    name: 'Nutella Swirl Brownie',
    description: 'Our signature brownie swirled with generous amounts of Nutella hazelnut spread, creating a heavenly combination.',
    price: 349,
    discountPrice: 299,
    category: 'brownies',
    images: ['/images/brownie.png'],
    stock: 35,
    isVeg: true,
    isEggless: true,
    weight: '250g',
    servings: '4',
    ingredients: 'Chocolate, Nutella, butter, flour, sugar, cocoa powder',
    isFeatured: false,
    isBestseller: true,
    tags: ['nutella', 'hazelnut', 'eggless'],
  },
  {
    name: 'Classic Cocoa Brownie',
    description: 'Simple, timeless, and perfect. A classic cocoa brownie with a crackly top and soft, fudgy center.',
    price: 199,
    discountPrice: 0,
    category: 'brownies',
    images: ['/images/brownie.png'],
    stock: 60,
    isVeg: true,
    isEggless: true,
    weight: '200g',
    servings: '4',
    ingredients: 'Cocoa powder, butter, flour, sugar, vanilla extract',
    isFeatured: false,
    isBestseller: false,
    tags: ['classic', 'cocoa', 'eggless', 'value'],
  },

  // PASTRIES
  {
    name: 'Butter Croissant',
    description: 'Flaky, buttery French croissant made with 27 layers of laminated dough. Baked fresh every morning.',
    price: 149,
    discountPrice: 0,
    category: 'pastries',
    images: ['/images/pastry.png'],
    stock: 30,
    isVeg: true,
    isEggless: false,
    weight: '80g',
    servings: '1',
    ingredients: 'Flour, French butter, yeast, milk, sugar, salt',
    isFeatured: true,
    isBestseller: true,
    tags: ['croissant', 'french', 'breakfast', 'butter'],
  },
  {
    name: 'Chocolate Eclair',
    description: 'Choux pastry filled with silky vanilla pastry cream and topped with rich chocolate ganache glaze.',
    price: 179,
    discountPrice: 0,
    category: 'pastries',
    images: ['/images/pastry.png'],
    stock: 25,
    isVeg: true,
    isEggless: false,
    weight: '100g',
    servings: '1',
    ingredients: 'Choux pastry, pastry cream, chocolate ganache, vanilla',
    isFeatured: true,
    isBestseller: false,
    tags: ['eclair', 'chocolate', 'french', 'cream'],
  },
  {
    name: 'Mixed Berry Danish',
    description: 'Golden puff pastry filled with sweet cream cheese and topped with a medley of fresh seasonal berries.',
    price: 189,
    discountPrice: 159,
    category: 'pastries',
    images: ['/images/pastry.png'],
    stock: 20,
    isVeg: true,
    isEggless: false,
    weight: '120g',
    servings: '1',
    ingredients: 'Puff pastry, cream cheese, blueberries, strawberries, raspberries',
    isFeatured: false,
    isBestseller: false,
    tags: ['danish', 'berry', 'cream cheese'],
  },
  {
    name: 'Almond Puff Pastry',
    description: 'Crispy puff pastry layered with almond frangipane cream and topped with sliced almonds and powdered sugar.',
    price: 169,
    discountPrice: 0,
    category: 'pastries',
    images: ['/images/pastry.png'],
    stock: 22,
    isVeg: true,
    isEggless: true,
    weight: '100g',
    servings: '1',
    ingredients: 'Puff pastry, almonds, sugar, butter, almond extract',
    isFeatured: false,
    isBestseller: false,
    tags: ['almond', 'puff', 'eggless'],
  },

  // CUPCAKES
  {
    name: 'Rose Pistachio Cupcake',
    description: 'Delicate rose-flavored cupcake topped with creamy pistachio buttercream and edible rose petals. A fusion of Indian and Western flavors.',
    price: 199,
    discountPrice: 0,
    category: 'cupcakes',
    images: ['/images/cupcake.png'],
    stock: 40,
    isVeg: true,
    isEggless: true,
    weight: '90g',
    servings: '1',
    ingredients: 'Flour, rose water, pistachios, butter, sugar, cream, edible rose petals',
    isFeatured: true,
    isBestseller: true,
    tags: ['rose', 'pistachio', 'eggless', 'indian'],
  },
  {
    name: 'Double Chocolate Cupcake',
    description: 'Moist chocolate cupcake with a molten chocolate center, topped with rich chocolate ganache frosting and chocolate shavings.',
    price: 179,
    discountPrice: 149,
    category: 'cupcakes',
    images: ['/images/cupcake.png'],
    stock: 45,
    isVeg: true,
    isEggless: false,
    weight: '90g',
    servings: '1',
    ingredients: 'Dark chocolate, cocoa, butter, flour, sugar, eggs, cream',
    isFeatured: true,
    isBestseller: false,
    tags: ['chocolate', 'double chocolate', 'ganache'],
  },
  {
    name: 'Vanilla Rainbow Cupcake',
    description: 'Fluffy vanilla cupcake with colorful rainbow sprinkles baked in, topped with swirled vanilla buttercream frosting.',
    price: 159,
    discountPrice: 0,
    category: 'cupcakes',
    images: ['/images/cupcake.png'],
    stock: 35,
    isVeg: true,
    isEggless: true,
    weight: '85g',
    servings: '1',
    ingredients: 'Flour, vanilla, butter, sugar, sprinkles, cream',
    isFeatured: false,
    isBestseller: false,
    tags: ['vanilla', 'rainbow', 'fun', 'kids', 'eggless'],
  },
  {
    name: 'Blueberry Cream Cheese Cupcake',
    description: 'Light blueberry cupcake filled with tangy cream cheese and topped with fresh blueberry compote.',
    price: 189,
    discountPrice: 0,
    category: 'cupcakes',
    images: ['/images/cupcake.png'],
    stock: 30,
    isVeg: true,
    isEggless: false,
    weight: '95g',
    servings: '1',
    ingredients: 'Blueberries, cream cheese, flour, butter, sugar, eggs, lemon zest',
    isFeatured: false,
    isBestseller: true,
    tags: ['blueberry', 'cream cheese', 'fruity'],
  },
];

const coupons = [
  {
    code: 'WELCOME10',
    description: 'Welcome discount - 10% off on your first order',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 300,
    maxDiscount: 200,
    usageLimit: 100,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
  },
  {
    code: 'SWEET20',
    description: 'Flat ₹20 off on orders above ₹500',
    discountType: 'fixed',
    discountValue: 20,
    minOrderAmount: 500,
    maxDiscount: 20,
    usageLimit: 50,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
  },
  {
    code: 'BLOOM25',
    description: '25% off on orders above ₹1000 (max ₹500 discount)',
    discountType: 'percentage',
    discountValue: 25,
    minOrderAmount: 1000,
    maxDiscount: 500,
    usageLimit: 30,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
      Review.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@bloomingbakers.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('👤 Admin user created: admin@bloomingbakers.com / admin123');

    // Create demo user
    const demoUser = await User.create({
      name: 'Tanvi',
      email: 'tanvi@example.com',
      password: 'password123',
      role: 'user',
    });
    console.log('👤 Demo user created: tanvi@example.com / password123');

    // Seed products
    const createdProducts = await Product.insertMany(products);
    console.log(`🧁 ${createdProducts.length} products seeded`);

    // Seed coupons
    await Coupon.insertMany(coupons);
    console.log(`🎟️  ${coupons.length} coupons seeded`);

    // Add some sample reviews
    const sampleReviews = [
      { user: demoUser._id, product: createdProducts[0]._id, rating: 5, comment: 'Absolutely delicious! Best chocolate cake I have ever had. Will order again!' },
      { user: demoUser._id, product: createdProducts[4]._id, rating: 5, comment: 'These brownies are incredibly fudgy and rich. The walnuts add the perfect crunch!' },
      { user: demoUser._id, product: createdProducts[8]._id, rating: 4, comment: 'Perfectly flaky croissant. Tastes like Paris! Could use a touch more butter though.' },
      { user: admin._id, product: createdProducts[0]._id, rating: 4, comment: 'Great cake! The chocolate truffle cream is heavenly.' },
      { user: admin._id, product: createdProducts[12]._id, rating: 5, comment: 'The rose pistachio combination is unique and absolutely divine!' },
    ];

    for (const review of sampleReviews) {
      await Review.create(review);
    }
    console.log(`⭐ ${sampleReviews.length} sample reviews created`);

    console.log('\n🌸 Database seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
