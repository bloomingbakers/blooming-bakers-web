import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories } from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
