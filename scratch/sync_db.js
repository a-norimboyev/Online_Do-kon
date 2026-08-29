import fs from 'fs';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_PROMOS,
  REGIONS_UZB
} from '../src/data/initialData.js';

const initialData = {
  products: INITIAL_PRODUCTS,
  categories: INITIAL_CATEGORIES,
  orders: INITIAL_ORDERS,
  promos: INITIAL_PROMOS,
  regions: REGIONS_UZB
};

fs.writeFileSync('./server/data.json', JSON.stringify(initialData, null, 2), 'utf-8');
console.log('Database synced successfully with all 28 products!');
