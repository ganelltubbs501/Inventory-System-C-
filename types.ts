export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  quantity: number;
  cost: number;
  category: string;
  lastUpdated: string;
}

export type InventoryFormData = Omit<InventoryItem, 'id' | 'lastUpdated'>;

export interface StatMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}
