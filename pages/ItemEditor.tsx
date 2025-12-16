import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getInventoryItemById, saveInventoryItem } from '../services/inventoryService';
import { InventoryFormData } from '../types';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';

const ItemEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<InventoryFormData>({
    sku: '',
    name: '',
    description: '',
    quantity: 0,
    cost: 0,
    category: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof InventoryFormData, string>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const item = getInventoryItemById(id);
      if (item) {
        setFormData({
            sku: item.sku,
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            cost: item.cost,
            category: item.category
        });
      } else {
        navigate('/inventory');
      }
    }
  }, [id, isEditing, navigate]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.name.trim()) newErrors.name = 'Item Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (formData.quantity < 0) newErrors.quantity = 'Quantity cannot be negative';
    if (formData.cost < 0) newErrors.cost = 'Cost cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate network delay for UX
    setTimeout(() => {
      saveInventoryItem(formData, id);
      setLoading(false);
      navigate('/inventory');
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
    // Clear error when user types
    if (errors[name as keyof InventoryFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const categories = ['Electronics', 'Furniture', 'Stationery', 'Accessories', 'Raw Materials', 'Other'];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/inventory')}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Item' : 'New Inventory Item'}
          </h1>
          <p className="text-gray-500">
            {isEditing ? `Update details for ${formData.name}` : 'Enter details to create a new stock item'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8">
        
        {/* Section 1: Identification */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Identification</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">SKU (Stock Keeping Unit)</label>
              <input
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.sku ? 'border-red-300 ring-red-200' : 'border-gray-300'}`}
                placeholder="e.g. ELEC-001"
              />
              {errors.sku && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.sku}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Item Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.name ? 'border-red-300 ring-red-200' : 'border-gray-300'}`}
                placeholder="Product Name"
              />
              {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.name}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.description ? 'border-red-300 ring-red-200' : 'border-gray-300'}`}
              placeholder="Detailed description of the item..."
            />
            {errors.description && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.description}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white ${errors.category ? 'border-red-300 ring-red-200' : 'border-gray-300'}`}
            >
              <option value="">Select a Category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {errors.category && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.category}</p>}
          </div>
        </div>

        {/* Section 2: Stock & Pricing */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Inventory & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quantity on Hand</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.quantity ? 'border-red-300 ring-red-200' : 'border-gray-300'}`}
              />
              {errors.quantity && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.quantity}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Unit Cost ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full pl-7 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.cost ? 'border-red-300 ring-red-200' : 'border-gray-300'}`}
                />
              </div>
              {errors.cost && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.cost}</p>}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/inventory')}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemEditor;
