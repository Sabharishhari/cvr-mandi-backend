import express from 'express';
import {
  storePurchasePrices,
  storeSalesPrices,
  getPurchasePrices,
  getSalesPrices,
} from '../controllers/priceController.js';

const router = express.Router();

router.get('/fetch/purchase', storePurchasePrices);
router.get('/fetch/sales', storeSalesPrices);

router.get('/purchase', getPurchasePrices);
router.get('/sales', getSalesPrices);

export default router;
