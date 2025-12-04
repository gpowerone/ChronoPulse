'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const limit = 20;
  const formatDate = dateString => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return dateString;
    }
  };
  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };
  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (tierFilter) params.append('loyalty_tier', tierFilter);
      const response = await fetch(`/api/customerslist?${params}`, {
        method: 'GET'
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setError('unauthorized');
        } else {
          throw new Error(`Failed to fetch customers: ${response.statusText}`);
        }
        return;
      }
      const data = await response.json();
      if (data.data) {
        setCustomers(data.data);
        setTotalCount(data.pagination?.total || data.data.length);
        setTotalPages(data.pagination?.pages || 1);
      } else {
        setError('fetch-failed');
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('fetch-error');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, [page, searchTerm, statusFilter, tierFilter]);
  const handleSearch = e => {
    setSearchTerm(e.target.value);
    setPage(1);
  };
  const handleStatusFilter = e => {
    setStatusFilter(e.target.value);
    setPage(1);
  };
  const handleTierFilter = e => {
    setTierFilter(e.target.value);
    setPage(1);
  };
  const handleViewCustomer = async customer => {
    try {
      const response = await fetch(`/api/customersget?id=${customer.id}`, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedCustomer(data.data || customer);
      } else {
        setSelectedCustomer(customer);
      }
    } catch (err) {
      setSelectedCustomer(customer);
    }
  };
  const handleEditCustomer = customer => {
    setEditCustomer({
      ...customer
    });
  };
  const handleSaveCustomer = async () => {
    if (!editCustomer) return;
    setIsSaving(true);
    try {
      const response = await fetch('/api/customersupdate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editCustomer)
      });
      if (response.ok) {
        setEditCustomer(null);
        fetchCustomers();
      }
    } catch (err) {
      console.error('Error saving customer:', err);
    } finally {
      setIsSaving(false);
    }
  };
  const exportToCSV = () => {
    if (!customers || customers.length === 0) return;
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Status', 'Tier', 'Total Spent', 'Orders', 'Member Since'];
    const rows = customers.map(c => [c.first_name, c.last_name, c.email, c.phone || '', c.status, c.loyalty_tier, c.total_spent || 0, c.total_orders || 0, formatDate(c.created_at)]);
    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customers_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const getTierColor = tier => {
    switch (tier?.toLowerCase()) {
      case 'platinum':
        return 'bg-purple-100 text-purple-800';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'silver':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };
  const getStatusColor = status => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };
  if (isLoading) {
    return <div className='customers-container p-6'><div className='flex justify-center items-center min-h-[400px]'><div className='text-center'><div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4' /><p>Loading customers...</p></div></div></div>;
  }
  if (error === 'unauthorized') {
    return <div className='customers-container p-6'><div className='max-w-md mx-auto mt-12 bg-red-50 border border-red-200 rounded-lg p-6 text-center'><svg className='w-12 h-12 text-red-600 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' /></svg><h3 className='text-lg font-semibold text-red-800 mb-2'>Unauthorized Access</h3><p className='text-red-700'>You need administrator privileges to view this page.</p></div></div>;
  }
  if (error && error !== 'unauthorized') {
    return <div className='customers-container p-6'><div className='max-w-md mx-auto mt-12 bg-red-50 border border-red-200 rounded-lg p-6 text-center'><svg className='w-12 h-12 text-red-600 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /></svg><h3 className='text-lg font-semibold text-red-800 mb-2'>Error loading customers</h3><button onClick={fetchCustomers} className='mt-4 px-4 py-2 rounded'>Retry</button></div></div>;
  }
  const DetailModal = () => {
    if (!selectedCustomer) return null;
    return <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'><div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'><div className='p-6 border-b'><div className='flex justify-between items-center'><h2 className='text-xl font-bold text-gray-900'>Customer Details</h2><button onClick={() => setSelectedCustomer(null)} className='p-2 !bg-transparent border border-current rounded-lg'>✕</button></div></div><div className='p-6 space-y-4'><div className='grid grid-cols-2 gap-4'><div><label className='text-sm text-gray-500'>First Name</label><p className='font-medium text-gray-900'>{selectedCustomer.first_name}</p></div><div><label className='text-sm text-gray-500'>Last Name</label><p className='font-medium text-gray-900'>{selectedCustomer.last_name}</p></div><div><label className='text-sm text-gray-500'>Email</label><p className='font-medium text-gray-900'>{selectedCustomer.email}</p></div><div><label className='text-sm text-gray-500'>Phone</label><p className='font-medium text-gray-900'>{selectedCustomer.phone || '-'}</p></div><div><label className='text-sm text-gray-500'>Status</label><span className={`inline-block px-2 py-1 rounded text-sm ${getStatusColor(selectedCustomer.status)}`}>{selectedCustomer.status}</span></div><div><label className='text-sm text-gray-500'>Tier</label><span className={`inline-block px-2 py-1 rounded text-sm ${getTierColor(selectedCustomer.loyalty_tier)}`}>{selectedCustomer.loyalty_tier}</span></div><div><label className='text-sm text-gray-500'>Loyalty Points</label><p className='font-medium text-gray-900'>{(selectedCustomer.loyalty_points || 0).toLocaleString()}</p></div><div><label className='text-sm text-gray-500'>Total Spent</label><p className='font-medium text-gray-900'>{formatCurrency(selectedCustomer.total_spent)}</p></div><div><label className='text-sm text-gray-500'>Orders</label><p className='font-medium text-gray-900'>{selectedCustomer.total_orders || 0}</p></div><div><label className='text-sm text-gray-500'>Member Since</label><p className='font-medium text-gray-900'>{formatDate(selectedCustomer.created_at)}</p></div></div></div><div className='p-6 border-t flex justify-end'><button onClick={() => setSelectedCustomer(null)} className='px-4 py-2 !bg-transparent border border-current rounded-lg'>Close</button></div></div></div>;
  };
  const EditModal = () => {
    if (!editCustomer) return null;
    return <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'><div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'><div className='p-6 border-b'><div className='flex justify-between items-center'><h2 className='text-xl font-bold text-gray-900'>Edit Customer</h2><button onClick={() => setEditCustomer(null)} className='p-2 !bg-transparent border border-current rounded-lg'>✕</button></div></div><div className='p-6 space-y-4'><div className='grid grid-cols-2 gap-4'><div><label className='block text-sm text-gray-700 mb-1'>First Name</label><input type='text' value={editCustomer.first_name || ''} onChange={e => setEditCustomer({
                ...editCustomer,
                first_name: e.target.value
              })} className='w-full px-3 py-2 border rounded' /></div><div><label className='block text-sm text-gray-700 mb-1'>Last Name</label><input type='text' value={editCustomer.last_name || ''} onChange={e => setEditCustomer({
                ...editCustomer,
                last_name: e.target.value
              })} className='w-full px-3 py-2 border rounded' /></div><div><label className='block text-sm text-gray-700 mb-1'>Email</label><input type='email' value={editCustomer.email || ''} onChange={e => setEditCustomer({
                ...editCustomer,
                email: e.target.value
              })} className='w-full px-3 py-2 border rounded' /></div><div><label className='block text-sm text-gray-700 mb-1'>Phone</label><input type='tel' value={editCustomer.phone || ''} onChange={e => setEditCustomer({
                ...editCustomer,
                phone: e.target.value
              })} className='w-full px-3 py-2 border rounded' /></div><div><label className='block text-sm text-gray-700 mb-1'>Status</label><select value={editCustomer.status || 'active'} onChange={e => setEditCustomer({
                ...editCustomer,
                status: e.target.value
              })} className='w-full px-3 py-2 border rounded'><option value='active'>Active</option><option value='inactive'>Inactive</option></select></div><div><label className='block text-sm text-gray-700 mb-1'>Tier</label><select value={editCustomer.loyalty_tier || 'bronze'} onChange={e => setEditCustomer({
                ...editCustomer,
                loyalty_tier: e.target.value
              })} className='w-full px-3 py-2 border rounded'><option value='bronze'>Bronze</option><option value='silver'>Silver</option><option value='gold'>Gold</option><option value='platinum'>Platinum</option></select></div></div></div><div className='p-6 border-t flex justify-end gap-3'><button onClick={() => setEditCustomer(null)} className='px-4 py-2 !bg-transparent border border-current rounded-lg'>Cancel</button><button onClick={handleSaveCustomer} disabled={isSaving} className='px-4 py-2 rounded-lg'>{isSaving ? "Saving..." : "Save Changes"}</button></div></div></div>;
  };
  if (customers.length === 0 && !searchTerm && !statusFilter && !tierFilter) {
    return <div className='customers-container p-6'><div className='mb-6'><h1 className='text-2xl font-bold mb-2'>Customer Management</h1><p>View and manage customer profiles</p></div><div className='bg-gray-50 border border-gray-200 rounded-lg p-12 text-center'><svg className='w-16 h-16 mx-auto mb-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' /></svg><h3 className='text-lg font-semibold text-gray-800 mb-2'>No customers found</h3><p className='text-gray-600'>Customers will appear here once they sign up and make purchases.</p></div></div>;
  }
  return <div className='customers-container p-6'>{DetailModal()}{EditModal()}<div className='mb-6'><div className='flex justify-between items-start flex-wrap gap-4'><div><h1 className='text-2xl font-bold mb-2'>Customer Management</h1><p>View and manage customer profiles</p></div><div className='text-right'><div className='text-sm mb-2'>Total Customers</div><div className='text-2xl font-bold mb-3'>{totalCount.toLocaleString()}</div><button onClick={exportToCSV} disabled={customers.length === 0} className='px-4 py-2 rounded'>Export to CSV</button></div></div></div><div className='mb-6 flex flex-wrap gap-4'><input type='text' placeholder='Search customers...' value={searchTerm} onChange={handleSearch} className='flex-1 min-w-[200px] px-4 py-2 border rounded' /><select value={statusFilter} onChange={handleStatusFilter} className='px-4 py-2 border rounded'><option value=''>All Status</option><option value='active'>Active</option><option value='inactive'>Inactive</option></select><select value={tierFilter} onChange={handleTierFilter} className='px-4 py-2 border rounded'><option value=''>All Tiers</option><option value='bronze'>Bronze</option><option value='silver'>Silver</option><option value='gold'>Gold</option><option value='platinum'>Platinum</option></select></div><div className='bg-white rounded-lg border border-gray-200 overflow-hidden'><div className='overflow-x-auto'><table className='w-full'><thead><tr className='bg-gray-50 border-b border-gray-200'><th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Customer</th><th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Email</th><th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th><th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Tier</th><th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Total Spent</th><th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Orders</th><th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th></tr></thead><tbody className='divide-y divide-gray-200'>{customers.length === 0 ? <tr><td colSpan={7} className='px-6 py-12 text-center text-gray-700'>No customers found</td></tr> : customers.map(customer => <tr key={customer.id} className='hover:bg-gray-50'><td className='px-6 py-4 whitespace-nowrap'><div className='font-medium text-gray-900'>{`${customer.first_name} ${customer.last_name}`}</div></td><td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>{customer.email}</td><td className='px-6 py-4 whitespace-nowrap'><span className={`px-2 py-1 rounded text-xs ${getStatusColor(customer.status)}`}>{customer.status}</span></td><td className='px-6 py-4 whitespace-nowrap'><span className={`px-2 py-1 rounded text-xs ${getTierColor(customer.loyalty_tier)}`}>{customer.loyalty_tier}</span></td><td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{formatCurrency(customer.total_spent)}</td><td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{customer.total_orders || 0}</td><td className='px-6 py-4 whitespace-nowrap'><div className='flex gap-2'><button onClick={() => handleViewCustomer(customer)} className='text-sm'>View</button><button onClick={() => handleEditCustomer(customer)} className='px-2 py-1 !bg-transparent border border-current rounded-lg text-sm'>Edit</button></div></td></tr>)}</tbody></table></div></div>{totalPages > 1 && <div className='mt-6 flex justify-center gap-4'><button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className='px-4 py-2 border rounded disabled:opacity-50'>Previous</button><span className='px-4 py-2'>{`${page} / ${totalPages}`}</span><button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className='px-4 py-2 border rounded disabled:opacity-50'>Next</button></div>}</div>;
}