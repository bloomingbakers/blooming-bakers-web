import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['cakes', 'brownies', 'pastries', 'cupcakes', 'cookies', 'breads', 'beverages'],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    isEggless: {
      type: Boolean,
      default: false,
    },
    weight: {
      type: String,
      default: '',
    },
    servings: {
      type: String,
      default: '',
    },
    ingredients: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    tags: [String],
  },
  { timestamps: true }
);

// Create text index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
