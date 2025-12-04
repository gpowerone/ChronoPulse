'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [timeSummary, setTimeSummary] = useState(null);
  const [invoiceSummary, setInvoiceSummary] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [timeEntries, setTimeEntries] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        const [employeesRes, projectsRes, timeSummaryRes, invoiceSummaryRes, subscriptionsRes, tiersRes, timeEntriesRes, invoicesRes] = await Promise.all([fetch('/api/employeeslist?limit=1000'), fetch('/api/projectslist?limit=1000'), fetch('/api/timeentriessummary?start_date=' + startOfMonth + '&end_date=' + endOfMonth), fetch('/api/invoicessummary?start_date=' + startOfMonth + '&end_date=' + endOfMonth), fetch('/api/subscriptionslist'), fetch('/api/tierslist'), fetch('/api/timeentrieslist?limit=5'), fetch('/api/invoiceslist?limit=5')]);
        if (employeesRes.status === 401 || projectsRes.status === 401) {
          setError('Unauthorized access');
          setLoading(false);
          return;
        }
        const employeesData = await employeesRes.json();
        const projectsData = await projectsRes.json();
        const timeSummaryData = await timeSummaryRes.json();
        const invoiceSummaryData = await invoiceSummaryRes.json();
        const subscriptionsData = await subscriptionsRes.json();
        const tiersData = await tiersRes.json();
        const timeEntriesData = await timeEntriesRes.json();
        const invoicesData = await invoicesRes.json();
        setEmployees(employeesData.data || []);
        setProjects(projectsData.data || []);
        setTimeSummary(timeSummaryData);
        setInvoiceSummary(invoiceSummaryData);
        setSubscriptions(subscriptionsData.data || []);
        setTiers(tiersData.data || []);
        setTimeEntries(timeEntriesData.data || []);
        setInvoices(invoicesData.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };
  const formatMinutesToHours = minutes => {
    const hours = Math.floor((minutes || 0) / 60);
    const mins = (minutes || 0) % 60;
    return hours + 'h ' + mins + 'm';
  };
  const ClockIcon = () => <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>;
  const UsersIcon = () => <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' /></svg>;
  const FolderIcon = () => <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' /></svg>;
  const CurrencyIcon = () => <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>;
  const DocumentIcon = () => <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' /></svg>;
  const ChartIcon = () => <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' /></svg>;
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
  const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'in_progress').length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const MetricCard = props => <div className='bg-white/10 border border-white/20 p-3 sm:p-4 md:p-6 rounded-lg'><div className='flex items-center justify-between mb-3 sm:mb-4'><div className='text-blue-400'>{props.icon}</div>{props.change ? <span className='text-green-400 text-sm'>{props.change}</span> : null}</div><div className='text-2xl sm:text-3xl font-bold text-white mb-1'>{props.value}</div><div className='text-gray-400 text-sm'>{props.label}</div></div>;
  if (loading) {
    return <div className='w-full p-3 sm:p-4 md:p-6 lg:p-8'><div className='flex items-center justify-center h-64'><div className='text-white text-lg'>Loading dashboard...</div></div></div>;
  }
  if (error) {
    return <div className='w-full p-3 sm:p-4 md:p-6 lg:p-8'><div className='bg-red-500/20 border border-red-500/50 p-4 rounded-lg text-center'><p className='text-red-400'>{error}</p></div></div>;
  }
  return <div className='w-full p-3 sm:p-4 md:p-6 lg:p-8'><div className='mb-6 sm:mb-8'><h1 className='text-2xl sm:text-3xl font-bold text-white mb-2'>Admin Dashboard</h1><p className='text-gray-400'>Overview of your time tracking system</p></div><div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8'><MetricCard icon={<UsersIcon />} value={activeEmployees} label='Active Employees' /><MetricCard icon={<FolderIcon />} value={activeProjects} label='Active Projects' /><MetricCard icon={<ClockIcon />} value={formatMinutesToHours(timeSummary ? timeSummary.total_minutes : 0)} label='Hours Tracked This Month' /><MetricCard icon={<ChartIcon />} value={formatMinutesToHours(timeSummary ? timeSummary.billable_minutes : 0)} label='Billable Hours' /><MetricCard icon={<CurrencyIcon />} value={formatCurrency(timeSummary ? timeSummary.total_earnings : 0)} label='Total Earnings' /><MetricCard icon={<DocumentIcon />} value={formatCurrency(invoiceSummary ? invoiceSummary.total_invoiced : 0)} label='Total Invoiced' /><MetricCard icon={<CurrencyIcon />} value={formatCurrency(invoiceSummary ? invoiceSummary.total_outstanding : 0)} label='Outstanding Amount' /><MetricCard icon={<ChartIcon />} value={activeSubscriptions} label='Active Subscriptions' /></div><div className='grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8'><div className='bg-white/10 border border-white/20 p-3 sm:p-4 md:p-6 rounded-lg'><h2 className='text-lg sm:text-xl font-semibold text-white mb-4'>Recent Time Entries</h2>{timeEntries.length === 0 ? <p className='text-gray-400'>No recent time entries</p> : <div className='space-y-3'>{timeEntries.slice(0, 5).map((entry, index) => <div key={entry.id || index} className='flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg'><div><p className='text-white text-sm sm:text-base'>{entry.description || 'No description'}</p><p className='text-gray-400 text-xs sm:text-sm'>{entry.project_name || 'No project'}</p></div><div className='text-right'><p className='text-blue-400 font-semibold text-sm sm:text-base'>{formatMinutesToHours(entry.duration_minutes)}</p>{entry.is_billable ? <span className='text-green-400 text-xs'>Billable</span> : null}</div></div>)}</div>}</div><div className='bg-white/10 border border-white/20 p-3 sm:p-4 md:p-6 rounded-lg'><h2 className='text-lg sm:text-xl font-semibold text-white mb-4'>Recent Invoices</h2>{invoices.length === 0 ? <p className='text-gray-400'>No recent invoices</p> : <div className='space-y-3'>{invoices.slice(0, 5).map((invoice, index) => <div key={invoice.id || index} className='flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg'><div><p className='text-white text-sm sm:text-base'>{invoice.invoice_number || invoice.client_name}</p><p className='text-gray-400 text-xs sm:text-sm'>{invoice.client_name}</p></div><div className='text-right'><p className='text-white font-semibold text-sm sm:text-base'>{formatCurrency(invoice.total)}</p><span className={invoice.status === 'paid' ? 'text-green-400 text-xs' : invoice.status === 'overdue' ? 'text-red-400 text-xs' : 'text-yellow-400 text-xs'}>{invoice.status}</span></div></div>)}</div>}</div></div><div className='grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6'><div className='bg-white/10 border border-white/20 p-3 sm:p-4 md:p-6 rounded-lg'><h2 className='text-lg sm:text-xl font-semibold text-white mb-4'>Invoice Status Breakdown</h2>{invoiceSummary && invoiceSummary.breakdown ? <div className='space-y-3'>{invoiceSummary.breakdown.map((item, index) => <div key={index} className='flex items-center justify-between'><span className='text-gray-300 capitalize'>{item.status || item.name}</span><span className='text-white font-semibold'>{formatCurrency(item.total || item.amount)}</span></div>)}</div> : <div className='space-y-3'><div className='flex items-center justify-between'><span className='text-gray-300'>Paid</span><span className='text-green-400 font-semibold'>{formatCurrency(invoiceSummary ? invoiceSummary.total_paid : 0)}</span></div><div className='flex items-center justify-between'><span className='text-gray-300'>Outstanding</span><span className='text-yellow-400 font-semibold'>{formatCurrency(invoiceSummary ? invoiceSummary.total_outstanding : 0)}</span></div><div className='flex items-center justify-between'><span className='text-gray-300'>Overdue</span><span className='text-red-400 font-semibold'>{invoiceSummary ? invoiceSummary.overdue_count : 0}</span></div></div>}</div><div className='bg-white/10 border border-white/20 p-3 sm:p-4 md:p-6 rounded-lg'><h2 className='text-lg sm:text-xl font-semibold text-white mb-4'>Subscription Tiers</h2>{tiers.length === 0 ? <p className='text-gray-400'>No subscription tiers configured</p> : <div className='space-y-3'>{tiers.map((tier, index) => <div key={tier.id || index} className='flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg'><div><p className='text-white text-sm sm:text-base'>{tier.name}</p><p className='text-gray-400 text-xs sm:text-sm'>{tier.billing_period}</p></div><div className='text-right'><p className='text-blue-400 font-semibold'>{formatCurrency(tier.price)}</p>{tier.enabled ? <span className='text-green-400 text-xs'>Enabled</span> : <span className='text-gray-500 text-xs'>Disabled</span>}</div></div>)}</div>}</div></div><div className='mt-6 sm:mt-8 flex flex-wrap gap-3'><button className='bg-blue-600 text-white p-2 sm:p-3 md:p-4 rounded-lg' onClick={() => router.push('/team_directory')}>Manage Team</button><button className='bg-blue-600 text-white p-2 sm:p-3 md:p-4 rounded-lg' onClick={() => router.push('/my_projects')}>View Projects</button><button className='bg-blue-600 text-white p-2 sm:p-3 md:p-4 rounded-lg' onClick={() => router.push('/invoices')}>Manage Invoices</button><button className='bg-blue-600 text-white p-2 sm:p-3 md:p-4 rounded-lg' onClick={() => router.push('/manage_tiers')}>Manage Tiers</button></div></div>;
}