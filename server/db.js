import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data.json');

import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_PROMOS,
  REGIONS_UZB
} from '../src/data/initialData.js';

// Initialize data.json if it doesn't exist
export function initDB() {
  if (!fs.existsSync(DB_FILE) || fs.readFileSync(DB_FILE, 'utf-8').trim().length === 0) {
    const initialData = {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      orders: INITIAL_ORDERS,
      promos: INITIAL_PROMOS,
      regions: REGIONS_UZB
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

export function readDB() {
  try {
    initDB();
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB:', error);
    return {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      orders: INITIAL_ORDERS,
      promos: INITIAL_PROMOS,
      regions: REGIONS_UZB
    };
  }
}

export function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing DB:', error);
    return false;
  }
}

export function resetDB() {
  const initialData = {
    products: INITIAL_PRODUCTS,
    categories: INITIAL_CATEGORIES,
    orders: INITIAL_ORDERS,
    promos: INITIAL_PROMOS,
    regions: REGIONS_UZB
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  return initialData;
}
