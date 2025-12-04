'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const router = useRouter();
  const [subscription, setSubscription] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const loadSubscriptionData = async () => {
      try {
        const subResponse = await fetch('/api/subscriptionslist', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (subResponse.ok) {
          const subData = await subResponse.json();
          if (subData && subData.length > 0) {
            setSubscription(subData[0]);
          }
        }
        const ordersResponse = await fetch('/api/saas_orderslist', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrders(ordersData || []);
        }
      } catch (err) {
        console.error('Error loading subscription:', err);
        setError('Failed to load subscription details');
      } finally {
        setIsLoading(false);
      }
    };
    loadSubscriptionData();
  }, []);
  const getStatusText = status => {
    switch (status) {
      case 'active':
        return "Active";
      case 'canceled':
        return "Canceled";
      case 'past_due':
        return "Past Due";
      default:
        return status;
    }
  };
  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-gray-100 text-gray-800';
      case 'past_due':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  const formatDate = dateString => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const formatTier = tier => {
    if (!tier) return 'Free';
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };
  const openStripeDashboard = () => {
    window.open('https://billing.stripe.com/p/login/your-portal-id', '_blank');
  };
  if (isLoading) {
    return <div className='flex justify-center items-center min-h-[400px]'><div className='text-center'><div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4' /><p className='opacity-90'>Loading subscription details...</p></div></div>;
  }
  return <div className='subscription-management max-w-4xl mx-auto p-6'><h1 className='text-3xl font-bold mb-8'>Subscription Management</h1>{error && <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700'>{error}</div>}<div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8'><h2 className='text-xl font-semibold mb-6 text-gray-800'>Your Current Plan</h2>{subscription && subscription.status !== 'inactive' ? <div className='space-y-4'><div className='grid grid-cols-2 gap-4'><div><p className='text-sm opacity-90 mb-1'>Plan Tier</p><p className='text-lg font-medium'>{formatTier(subscription.user_tier)}</p></div><div><p className='text-sm opacity-90 mb-1'>Status</p><span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>{getStatusText(subscription.status)}</span></div></div>{subscription.current_period_end && <div><p className='text-sm opacity-90 mb-1'>Renews On</p><p className='text-lg'>{formatDate(subscription.current_period_end)}</p></div>}{subscription.cancel_at_period_end && <div className='mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'><p className='text-yellow-800'>Your subscription will be canceled at the end of the current billing period.</p></div>}</div> : <div className='text-center py-8'><div className='text-gray-400 mb-4'><svg className='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' /></svg></div><p className='text-lg font-medium mb-4 text-gray-600'>No Active Subscription</p><button onClick={() => router.push('/pricing_plans')} className='inline-flex items-center px-6 py-3 rounded-lg font-medium'>View Available Plans</button></div>}</div>{subscription && subscription.status !== 'inactive' && <div className='bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white'><div className='flex items-center justify-between'><div><h3 className='text-xl font-semibold mb-2'>Manage Subscription in Stripe</h3><p className='opacity-90'>Update payment method, view invoices, cancel or change your plan</p></div><button onClick={openStripeDashboard} className='flex items-center gap-2 px-6 py-3 rounded-lg font-medium'><span>Open Stripe Portal</span><svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' /></svg></button></div></div>}{orders.length > 0 && <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'><h2 className='text-xl font-semibold mb-6'>Billing History</h2><div className='overflow-x-auto'><table className='w-full'><thead><tr className='border-b'><th className='text-left py-3 px-4 font-medium opacity-90'>Date</th><th className='text-left py-3 px-4 font-medium opacity-90'>Description</th><th className='text-left py-3 px-4 font-medium opacity-90'>Amount</th><th className='text-left py-3 px-4 font-medium opacity-90'>Status</th><th className='text-right py-3 px-4 font-medium opacity-90'>Invoice</th></tr></thead><tbody>{orders.slice(0, 10).map(order => <tr key={order.id} className='border-b last:border-0'><td className='py-3 px-4'>{formatDate(order.created_at)}</td><td className='py-3 px-4'>{order.description || 'Subscription payment'}</td><td className='py-3 px-4 font-medium'>{`$${parseFloat(order.amount).toFixed(2)}`}</td><td className='py-3 px-4'><span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{order.payment_status === 'paid' ? 'Paid' : 'Failed'}</span></td><td className='py-3 px-4 text-right'>{order.invoice_url && <a href={order.invoice_url} target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:text-blue-800'>View</a>}</td></tr>)}</tbody></table></div></div>}</div>;
}