import { InventoryItem, InventoryFormData } from '../types';

const STORAGE_KEY = 'inventory_data_v1';

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const MOCK_DATA: InventoryItem[] = [
  {
    id: '1',
    sku: 'TECH-001',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with 2.4GHz connection',
    quantity: 45,
    cost: 25.50,
    category: 'Electronics',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    sku: 'TECH-002',
    name: 'Mechanical Keyboard',
    description: 'RGB Backlit mechanical keyboard with blue switches',
    quantity: 12,
    cost: 85.00,
    category: 'Electronics',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    sku: 'FURN-101',
    name: 'Office Chair',
    description: 'Mesh back office chair with lumbar support',
    quantity: 8,
    cost: 150.00,
    category: 'Furniture',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '4',
    sku: 'STAT-055',
    name: 'A4 Paper Ream',
    description: 'Standard 80gsm A4 printer paper, 500 sheets',
    quantity: 120,
    cost: 4.50,
    category: 'Stationery',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '5',
    sku: 'TECH-003',
    name: '27" Monitor',
    description: '4K IPS Display 60Hz',
    quantity: 5,
    cost: 320.00,
    category: 'Electronics',
    lastUpdated: new Date().toISOString(),
  },
];

export const getInventoryItems = (): InventoryItem[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initialize with mock data if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
    return MOCK_DATA;
  }
  return JSON.parse(stored);
};

export const getInventoryItemById = (id: string): InventoryItem | undefined => {
  const items = getInventoryItems();
  return items.find((item) => item.id === id);
};

export const saveInventoryItem = (data: InventoryFormData, id?: string): void => {
  const items = getInventoryItems();
  
  if (id) {
    // Update existing
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...data,
        lastUpdated: new Date().toISOString(),
      };
    }
  } else {
    // Create new
    const newItem: InventoryItem = {
      ...data,
      id: generateId(),
      lastUpdated: new Date().toISOString(),
    };
    items.push(newItem);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const deleteInventoryItem = (id: string): void => {
  const items = getInventoryItems();
  const filtered = items.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
