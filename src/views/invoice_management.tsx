'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_address: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    line_items: [{
      description: '',
      quantity: 1,
      rate: 0
    }],
    tax_rate: 0,
    discount_amount: 0,
    notes: '',
    payment_terms: 'Net 30'
  });
  const fetchInvoices = async () => {
    try {
      let url = `/api/invoiceslist?page=${page}&limit=${limit}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      const response = await fetch(url, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.data || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
    }
  };
  const fetchSummary = async () => {
    try {
      const response = await fetch('/api/invoicessummary', {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };
  useEffect(() => {
    Promise.all([fetchInvoices(), fetchSummary()]).then(() => setIsLoading(false));
  }, [page, searchTerm, statusFilter]);
  const handleCreateInvoice = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        line_items: formData.line_items.map(item => ({
          ...item,
          amount: item.quantity * item.rate
        }))
      };
      const response = await fetch('/api/invoicescreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setShowForm(false);
        resetForm();
        fetchInvoices();
        fetchSummary();
      }
    } catch (err) {
      console.error('Error creating invoice:', err);
    }
  };
  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch('/api/invoicesupdate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          status
        })
      });
      if (response.ok) {
        fetchInvoices();
        fetchSummary();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };
  const handleDelete = async id => {
    if (!confirm('Delete this invoice?')) return;
    try {
      const response = await fetch(`/api/invoicesdelete?id=${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchInvoices();
        fetchSummary();
      }
    } catch (err) {
      console.error('Error deleting invoice:', err);
    }
  };
  const resetForm = () => {
    setFormData({
      client_name: '',
      client_email: '',
      client_address: '',
      issue_date: new Date().toISOString().split('T')[0],
      due_date: '',
      line_items: [{
        description: '',
        quantity: 1,
        rate: 0
      }],
      tax_rate: 0,
      discount_amount: 0,
      notes: '',
      payment_terms: 'Net 30'
    });
    setEditingInvoice(null);
  };
  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      line_items: [...prev.line_items, {
        description: '',
        quantity: 1,
        rate: 0
      }]
    }));
  };
  const updateLineItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      line_items: prev.line_items.map((item, i) => i === index ? {
        ...item,
        [field]: field === 'description' ? value : parseFloat(value) || 0
      } : item)
    }));
  };
  const removeLineItem = index => {
    if (formData.line_items.length > 1) {
      setFormData(prev => ({
        ...prev,
        line_items: prev.line_items.filter((_, i) => i !== index)
      }));
    }
  };
  const calculateTotals = () => {
    const subtotal = formData.line_items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const taxAmount = subtotal * (formData.tax_rate / 100);
    const total = subtotal + taxAmount - formData.discount_amount;
    return {
      subtotal,
      taxAmount,
      total
    };
  };
  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  const getStatusColor = status => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      paid: 'bg-emerald-100 text-emerald-700',
      overdue: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-200 text-gray-500'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };
  if (isLoading) {
    return <div className='p-6 flex justify-center items-center min-h-[400px]'><div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600' /></div>;
  }
  const SummaryCards = () => <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'><div className='bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-5 text-white shadow-lg'><p className='text-teal-100 text-sm font-medium'>Total Invoiced</p><p className='text-2xl font-bold mt-1'>{formatCurrency(summary?.total_invoiced || 0)}</p></div><div className='bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg'><p className='text-emerald-100 text-sm font-medium'>Total Paid</p><p className='text-2xl font-bold mt-1'>{formatCurrency(summary?.total_paid || 0)}</p></div><div className='bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white shadow-lg'><p className='text-amber-100 text-sm font-medium'>Outstanding</p><p className='text-2xl font-bold mt-1'>{formatCurrency(summary?.total_outstanding || 0)}</p></div><div className='bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-5 text-white shadow-lg'><p className='text-rose-100 text-sm font-medium'>Overdue</p><p className='text-2xl font-bold mt-1'>{summary?.overdue_count || 0}</p></div></div>;
  const InvoiceRow = ({
    invoice
  }) => {
    const isOverdue = invoice.status === 'sent' && new Date(invoice.due_date) < new Date();
    const displayStatus = isOverdue ? 'overdue' : invoice.status;
    return <tr className='hover:bg-gray-50 transition'><td className='px-6 py-4'><span className='font-mono font-medium text-gray-900'>{invoice.invoice_number}</span></td><td className='px-6 py-4'><div><p className='font-medium text-gray-900'>{invoice.client_name}</p>{invoice.client_email && <p className='text-sm text-gray-500'>{invoice.client_email}</p>}</div></td><td className='px-6 py-4 font-semibold text-gray-900'>{formatCurrency(invoice.total)}</td><td className='px-6 py-4 text-gray-600'>{new Date(invoice.issue_date).toLocaleDateString()}</td><td className='px-6 py-4 text-gray-600'>{new Date(invoice.due_date).toLocaleDateString()}</td><td className='px-6 py-4'><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(displayStatus)}`}></span></td><td className='px-6 py-4'><div className='flex items-center gap-2'><button onClick={() => setViewingInvoice(invoice)} className='p-2 !bg-transparent border border-current rounded-lg'>👁</button>{invoice.status === 'draft' && <button onClick={() => handleUpdateStatus(invoice.id, 'sent')} className='p-2 !bg-transparent border border-current rounded-lg' title='Mark as Sent'>📤</button>}{invoice.status === 'sent' && <button onClick={() => handleUpdateStatus(invoice.id, 'paid')} className='p-2 !bg-transparent border border-current rounded-lg' title='Mark as Paid'>✓</button>}{invoice.status !== 'paid' && <button onClick={() => handleDelete(invoice.id)} className='p-2 !bg-transparent border border-current rounded-lg'>🗑</button>}</div></td></tr>;
  };
  const InvoiceForm = () => {
    const {
      subtotal,
      taxAmount,
      total
    } = calculateTotals();
    return <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto'><div className='bg-white rounded-2xl max-w-3xl w-full my-8'><form onSubmit={handleCreateInvoice}><div className='p-6 border-b flex justify-between items-center'><h2 className='text-xl font-bold text-gray-900'>{editingInvoice ? "Edit" : "New Invoice"}</h2><button type='button' onClick={() => {
              setShowForm(false);
              resetForm();
            }} className='p-2 !bg-transparent border border-current rounded-lg text-2xl'>×</button></div><div className='p-6 space-y-6 max-h-[60vh] overflow-y-auto'><div className='grid grid-cols-1 md:grid-cols-2 gap-4'><div><label className='block text-sm font-medium text-gray-700 mb-1'>Client Name</label><input type='text' value={formData.client_name} onChange={e => setFormData(prev => ({
                  ...prev,
                  client_name: e.target.value
                }))} className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none' required={true} /></div><div><label className='block text-sm font-medium text-gray-700 mb-1'>Client Email</label><input type='email' value={formData.client_email} onChange={e => setFormData(prev => ({
                  ...prev,
                  client_email: e.target.value
                }))} className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none' /></div></div><div className='grid grid-cols-1 md:grid-cols-2 gap-4'><div><label className='block text-sm font-medium text-gray-700 mb-1'>Issue Date</label><input type='date' value={formData.issue_date} onChange={e => setFormData(prev => ({
                  ...prev,
                  issue_date: e.target.value
                }))} className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none' required={true} /></div><div><label className='block text-sm font-medium text-gray-700 mb-1'>Due Date</label><input type='date' value={formData.due_date} onChange={e => setFormData(prev => ({
                  ...prev,
                  due_date: e.target.value
                }))} className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none' required={true} /></div></div><div><label className='block text-sm font-medium text-gray-700 mb-3'>Line Items</label><div className='space-y-3'>{formData.line_items.map((item, index) => <div key={index} className='flex gap-3 items-start'><input type='text' placeholder='Description' value={item.description} onChange={e => updateLineItem(index, 'description', e.target.value)} className='flex-1 px-3 py-2 border rounded-lg focus:border-teal-500 focus:outline-none' /><input type='number' placeholder='Qty' value={item.quantity} onChange={e => updateLineItem(index, 'quantity', e.target.value)} className='w-20 px-3 py-2 border rounded-lg focus:border-teal-500 focus:outline-none' min='1' /><input type='number' placeholder='Rate' value={item.rate} onChange={e => updateLineItem(index, 'rate', e.target.value)} className='w-28 px-3 py-2 border rounded-lg focus:border-teal-500 focus:outline-none' step='0.01' /><span className='w-24 py-2 text-right font-medium text-gray-900'>{formatCurrency(item.quantity * item.rate)}</span><button type='button' onClick={() => removeLineItem(index)} className='p-2 !bg-transparent border border-current rounded-lg'>×</button></div>)}</div><button type='button' onClick={addLineItem} className='mt-3 px-4 py-2 !bg-transparent border border-current rounded-lg'>+ Add Line Item</button></div><div className='grid grid-cols-2 gap-4'><div><label className='block text-sm font-medium text-gray-700 mb-1'>Tax (%)</label><input type='number' value={formData.tax_rate} onChange={e => setFormData(prev => ({
                  ...prev,
                  tax_rate: parseFloat(e.target.value) || 0
                }))} className='w-full px-3 py-2 border rounded-lg focus:border-teal-500 focus:outline-none' step='0.01' /></div><div className='text-right space-y-2 pt-6'><p className='text-gray-600'>Subtotal: <span className='font-medium'>{formatCurrency(subtotal)}</span></p><p className='text-gray-600'>Tax: <span className='font-medium'>{formatCurrency(taxAmount)}</span></p><p className='text-lg font-bold text-gray-900'>Total: {formatCurrency(total)}</p></div></div><div><label className='block text-sm font-medium text-gray-700 mb-1'>Notes</label><textarea value={formData.notes} onChange={e => setFormData(prev => ({
                ...prev,
                notes: e.target.value
              }))} className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none' rows={3} /></div></div><div className='p-6 border-t flex justify-end gap-3'><button type='button' onClick={() => {
              setShowForm(false);
              resetForm();
            }} className='px-6 py-2 !bg-transparent border border-current rounded-lg'>Cancel</button><button type='submit' className='px-6 py-2 rounded-lg font-medium'>Save Invoice</button></div></form></div></div>;
  };
  const InvoiceDetail = () => {
    if (!viewingInvoice) return null;
    const invoice = viewingInvoice;
    return <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'><div className='bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'><div className='p-6 border-b flex justify-between items-center sticky top-0 bg-white'><div><h2 className='text-xl font-bold text-gray-900'>{invoice.invoice_number}</h2><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}></span></div><button onClick={() => setViewingInvoice(null)} className='p-2 !bg-transparent border border-current rounded-lg text-2xl'>×</button></div><div className='p-6 space-y-6'><div className='bg-gray-50 rounded-xl p-4'><h3 className='font-semibold text-gray-700 mb-2'>Client</h3><p className='font-medium text-gray-900'>{invoice.client_name}</p>{invoice.client_email && <p className='text-gray-600'>{invoice.client_email}</p>}{invoice.client_address && <p className='text-gray-600 whitespace-pre-line'>{invoice.client_address}</p>}</div><div className='grid grid-cols-2 gap-4'><div><p className='text-sm text-gray-500'>Issue Date</p><p className='font-medium text-gray-900'>{new Date(invoice.issue_date).toLocaleDateString()}</p></div><div><p className='text-sm text-gray-500'>Due Date</p><p className='font-medium text-gray-900'>{new Date(invoice.due_date).toLocaleDateString()}</p></div></div><div><h3 className='font-semibold text-gray-700 mb-3'>Line Items</h3><div className='border rounded-xl overflow-hidden'><table className='w-full'><thead className='bg-gray-50'><tr><th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>Description</th><th className='px-4 py-2 text-right text-sm font-medium text-gray-600'>Quantity</th><th className='px-4 py-2 text-right text-sm font-medium text-gray-600'>Rate</th><th className='px-4 py-2 text-right text-sm font-medium text-gray-600'>Amount</th></tr></thead><tbody>{(invoice.line_items || []).map((item, idx) => <tr key={idx} className='border-t'><td className='px-4 py-3 text-gray-900'>{item.description}</td><td className='px-4 py-3 text-right text-gray-900'>{item.quantity}</td><td className='px-4 py-3 text-right text-gray-900'>{formatCurrency(item.rate)}</td><td className='px-4 py-3 text-right font-medium text-gray-900'>{formatCurrency(item.amount || item.quantity * item.rate)}</td></tr>)}</tbody></table></div></div><div className='flex justify-end'><div className='w-64 space-y-2'><div className='flex justify-between text-gray-600'><span>Subtotal</span><span>{formatCurrency(invoice.subtotal)}</span></div>{invoice.tax_amount > 0 && <div className='flex justify-between text-gray-600'><span>Tax{` (${invoice.tax_rate}%)`}</span><span>{formatCurrency(invoice.tax_amount)}</span></div>}<div className='flex justify-between text-lg font-bold text-gray-900 pt-2 border-t'><span>Total</span><span>{formatCurrency(invoice.total)}</span></div></div></div>{invoice.notes && <div className='bg-gray-50 rounded-xl p-4'><h3 className='font-semibold text-gray-700 mb-2'>Notes</h3><p className='text-gray-600 whitespace-pre-line'>{invoice.notes}</p></div>}</div></div></div>;
  };
  return <div className='invoices-admin p-6 max-w-6xl mx-auto'>{showForm && InvoiceForm()}{InvoiceDetail()}<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'><div><h1 className='text-2xl font-bold'>Invoices</h1><p>Manage and track your invoices</p></div><button onClick={() => setShowForm(true)} className='px-5 py-2.5 rounded-xl font-medium'>+ New Invoice</button></div>{SummaryCards()}<div className='flex flex-col md:flex-row gap-4 mb-6'><input type='text' placeholder='Search invoices...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className='flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none' /><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className='px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none'><option value=''>All Status</option><option value='draft'>Draft</option><option value='sent'>Sent</option><option value='paid'>Paid</option><option value='cancelled'>Cancelled</option></select></div><div className='bg-white rounded-2xl shadow-lg overflow-hidden'>{invoices.length === 0 ? <div className='p-12 text-center'><div className='text-5xl mb-4'>📄</div><p className='text-gray-900 font-medium'>No invoices yet</p><p className='text-gray-600 mt-1'>Create your first invoice to get started.</p></div> : <table className='w-full'><thead className='bg-gray-50 border-b'><tr><th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Invoice #</th><th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Client</th><th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Amount</th><th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Date</th><th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Due Date</th><th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>Status</th><th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'></th></tr></thead><tbody className='divide-y divide-gray-100'>{invoices.map(invoice => <InvoiceRow key={invoice.id} invoice={invoice} />)}</tbody></table>}</div>{total > limit && <div className='flex justify-center gap-2 mt-6'><button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className='px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'>← Previous</button><span className='px-4 py-2'>{`Page ${page} of ${Math.ceil(total / limit)}`}</span><button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / limit)} className='px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'>Next →</button></div>}</div>;
}