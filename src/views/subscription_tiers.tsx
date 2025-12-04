'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const [tiers, setTiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingTier, setEditingTier] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    billing_period: 'monthly',
    stripe_price_id: '',
    features: [],
    display_order: 0,
    enabled: true,
    is_featured: false,
    trial_days: 0
  });
  const [newFeature, setNewFeature] = useState('');
  useEffect(() => {
    loadTiers();
  }, []);
  const loadTiers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tierslist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTiers(data.data || data || []);
      }
    } catch (err) {
      console.error('Error loading tiers:', err);
      setError('Failed to load tiers');
    } finally {
      setIsLoading(false);
    }
  };
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: 0,
      billing_period: 'monthly',
      stripe_price_id: '',
      features: [],
      display_order: 0,
      enabled: true,
      is_featured: false,
      trial_days: 0
    });
    setNewFeature('');
    setEditingTier(null);
    setShowForm(false);
  };
  const handleEdit = tier => {
    setEditingTier(tier);
    setFormData({
      name: tier.name || '',
      slug: tier.slug || '',
      description: tier.description || '',
      price: tier.price || 0,
      billing_period: tier.billing_period || 'monthly',
      stripe_price_id: tier.stripe_price_id || '',
      features: tier.features || [],
      display_order: tier.display_order || 0,
      enabled: tier.enabled !== false,
      is_featured: tier.is_featured || false,
      trial_days: tier.trial_days || 0
    });
    setShowForm(true);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      const url = editingTier ? `/api/tiersupdate?id=${editingTier.id}` : '/api/tierscreate';
      const method = editingTier ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save tier');
      }
      await loadTiers();
      resetForm();
    } catch (err) {
      console.error('Error saving tier:', err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };
  const handleDelete = async tier => {
    if (!confirm("Are you sure you want to delete this tier?")) return;
    try {
      const response = await fetch(`/api/tiersdelete?id=${tier.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete tier');
      }
      await loadTiers();
    } catch (err) {
      console.error('Error deleting tier:', err);
      setError(err.message);
    }
  };
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };
  const removeFeature = index => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };
  const generateSlug = name => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };
  if (isLoading) {
    return <div className='flex justify-center items-center min-h-[400px]'><div className='text-center'><div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4' /><p className='opacity-90'>Loading tiers...</p></div></div>;
  }
  return <div className='tiers-management max-w-6xl mx-auto p-6'><div className='flex justify-between items-center mb-8'><h1 className='text-3xl font-bold'>Subscription Tiers</h1>{!showForm && <button onClick={() => setShowForm(true)} className='px-4 py-2 rounded-lg font-medium flex items-center gap-2'><svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4v16m8-8H4' /></svg>Add New Tier</button>}</div>{error && <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex justify-between items-center'><span>{error}</span><button onClick={() => setError('')} className='p-2 !bg-transparent border border-current rounded-lg'>×</button></div>}{showForm && <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8'><h2 className='text-xl font-semibold text-gray-900 mb-6'>{editingTier ? `${"Edit"}: ${editingTier.name}` : "Add New Tier"}</h2><form onSubmit={handleSubmit} className='space-y-6'><div className='grid grid-cols-1 md:grid-cols-2 gap-4'><div><label className='block text-sm font-medium text-gray-700 mb-1'>Name</label><input type='text' value={formData.name} onChange={e => {
              const name = e.target.value;
              setFormData(prev => ({
                ...prev,
                name,
                slug: prev.slug || generateSlug(name)
              }));
            }} className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500' required={true} /></div><div><label className='block text-sm font-medium text-gray-700 mb-1'>Slug</label><input type='text' value={formData.slug} onChange={e => setFormData(prev => ({
              ...prev,
              slug: e.target.value
            }))} className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500' required={true} pattern='[a-z0-9-]+' /></div></div><div><label className='block text-sm font-medium text-gray-700 mb-1'>Description</label><textarea value={formData.description} onChange={e => setFormData(prev => ({
            ...prev,
            description: e.target.value
          }))} className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500' rows={2} /></div><div className='grid grid-cols-1 md:grid-cols-3 gap-4'><div><label className='block text-sm font-medium text-gray-700 mb-1'>Price</label><div className='relative'><span className='absolute left-3 top-2 text-gray-500'>$</span><input type='number' step='0.01' min='0' value={formData.price} onChange={e => setFormData(prev => ({
                ...prev,
                price: parseFloat(e.target.value) || 0
              }))} className='w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500' required={true} /></div></div><div><label className='block text-sm font-medium text-gray-700 mb-1'>Billing Period</label><select value={formData.billing_period} onChange={e => setFormData(prev => ({
              ...prev,
              billing_period: e.target.value
            }))} className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'><option value='monthly'>Monthly</option><option value='yearly'>Yearly</option></select></div><div><label className='block text-sm font-medium text-gray-700 mb-1'>Stripe Price ID</label><input type='text' value={formData.stripe_price_id} onChange={e => setFormData(prev => ({
              ...prev,
              stripe_price_id: e.target.value
            }))} className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500' placeholder='price_...' /></div></div><div><label className='block text-sm font-medium text-gray-700 mb-2'>Features</label><div className='space-y-2 mb-3'>{formData.features.map((feature, index) => <div key={index} className='flex items-center gap-2'><span className='flex-grow px-3 py-2 bg-gray-50 text-gray-900 rounded border'>{feature}</span><button type='button' onClick={() => removeFeature(index)} className='p-2 !bg-transparent border border-current rounded-lg'><svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' /></svg></button></div>)}</div><div className='flex gap-2'><input type='text' value={newFeature} onChange={e => setNewFeature(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature())} className='flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500' placeholder='Enter a feature...' /><button type='button' onClick={addFeature} className='px-4 py-2 !bg-transparent border border-current rounded-lg'>Add Feature</button></div></div><div className='grid grid-cols-1 md:grid-cols-2 gap-4'><div><label className='block text-sm font-medium text-gray-700 mb-1'>Display Order</label><input type='number' min='0' value={formData.display_order} onChange={e => setFormData(prev => ({
              ...prev,
              display_order: parseInt(e.target.value) || 0
            }))} className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500' /></div><div><label className='block text-sm font-medium text-gray-700 mb-1'>Trial Days</label><input type='number' min='0' value={formData.trial_days} onChange={e => setFormData(prev => ({
              ...prev,
              trial_days: parseInt(e.target.value) || 0
            }))} className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500' /></div></div><div className='flex gap-6'><label className='flex items-center gap-2 cursor-pointer'><input type='checkbox' checked={formData.enabled} onChange={e => setFormData(prev => ({
              ...prev,
              enabled: e.target.checked
            }))} className='w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500' /><span className='text-gray-700'>Enabled</span></label><label className='flex items-center gap-2 cursor-pointer'><input type='checkbox' checked={formData.is_featured} onChange={e => setFormData(prev => ({
              ...prev,
              is_featured: e.target.checked
            }))} className='w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500' /><span className='text-gray-700'>Featured</span></label></div><div className='flex gap-3 pt-4 border-t'><button type='submit' disabled={isSaving} className='px-6 py-2 rounded-lg font-medium'>{isSaving ? "Saving..." : "Save"}</button><button type='button' onClick={resetForm} className='px-6 py-2 !bg-transparent border border-current rounded-lg font-medium'>Cancel</button></div></form></div>}{tiers.length === 0 ? <div className='text-center py-16 bg-gray-50 rounded-xl'><p className='text-lg opacity-90'>No tiers configured yet</p></div> : <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>{tiers.map(tier => <div key={tier.id} className={`bg-white rounded-xl shadow-sm border-2 p-6 relative ${tier.is_featured ? 'border-blue-500' : 'border-gray-200'} ${!tier.enabled ? 'opacity-60' : ''}`}>{tier.is_featured && <div className='absolute -top-3 left-4 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full'>Featured</div>}{!tier.enabled && <div className='absolute -top-3 right-4 bg-gray-500 text-white text-xs font-medium px-3 py-1 rounded-full'>Disabled</div>}<div className='mb-4'><h3 className='text-xl font-semibold text-gray-900'>{tier.name}</h3><p className='text-sm text-gray-500'>{tier.slug}</p></div><div className='mb-4'><span className='text-3xl font-bold text-gray-900'>{tier.price > 0 ? `$${parseFloat(tier.price).toFixed(2)}` : 'Free'}</span>{tier.price > 0 && <span className='text-gray-500 ml-1'>{`/${tier.billing_period === 'yearly' ? 'year' : 'month'}`}</span>}</div>{tier.description && <p className='text-sm text-gray-600 mb-4'>{tier.description}</p>}{tier.features && tier.features.length > 0 && <div className='mb-4'><p className='text-sm font-medium text-gray-700 mb-2'>Features</p><ul className='text-sm text-gray-700 space-y-1'>{tier.features.slice(0, 3).map((feature, idx) => <li key={idx} className='flex items-center gap-2'><svg className='w-4 h-4 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' /></svg>{feature}</li>)}{tier.features.length > 3 && <li className='text-gray-500'>{`+${tier.features.length - 3} more`}</li>}</ul></div>}<div className='text-xs text-gray-500 mb-4 space-y-1'>{tier.stripe_price_id && <p>{`Stripe: ${tier.stripe_price_id}`}</p>}{tier.trial_days > 0 && <p>{`Trial: ${tier.trial_days} days`}</p>}<p>{`Order: ${tier.display_order}`}</p></div><div className='flex gap-2 pt-4 border-t'><button onClick={() => handleEdit(tier)} className='flex-1 px-4 py-2 !bg-transparent border border-current rounded-lg text-sm font-medium'>Edit</button><button onClick={() => handleDelete(tier)} className='px-4 py-2 !bg-transparent border border-current rounded-lg text-sm font-medium'>Delete</button></div></div>)}</div>}</div>;
}