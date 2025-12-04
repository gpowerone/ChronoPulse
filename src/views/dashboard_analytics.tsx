'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [projects, setProjects] = useState([]);
  const [timeEntries, setTimeEntries] = useState([]);
  const [timeSummary, setTimeSummary] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [invoiceSummary, setInvoiceSummary] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);
  useEffect(function () {
    fetchDashboardData();
  }, []);
  const fetchDashboardData = async function () {
    try {
      setLoading(true);
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const responses = await Promise.all([fetch('/api/customersbyuser'), fetch('/api/projectslist'), fetch('/api/timeentrieslist'), fetch('/api/timeentriessummary?start_date=' + startDate + '&end_date=' + endDate), fetch('/api/invoiceslist'), fetch('/api/invoicessummary'), fetch('/api/subscriptionslist'), fetch('/api/employeeslist'), fetch('/api/tierslist')]);
      for (let i = 0; i < responses.length; i++) {
        if (responses[i].status === 401) {
          setUnauthorized(true);
          setLoading(false);
          return;
        }
      }
      const results = await Promise.all(responses.map(function (r) {
        return r.ok ? r.json() : null;
      }));
      if (results[0]) setCustomer(results[0]);
      if (results[1] && results[1].data) setProjects(results[1].data);
      if (results[2] && results[2].data) setTimeEntries(results[2].data);
      if (results[3]) setTimeSummary(results[3]);
      if (results[4] && results[4].data) setInvoices(results[4].data);
      if (results[5]) setInvoiceSummary(results[5]);
      if (results[6] && results[6].data) setSubscriptions(results[6].data);
      if (results[7] && results[7].data) setEmployees(results[7].data);
      if (results[8] && results[8].data) setTiers(results[8].data);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };
  const formatCurrency = function (amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };
  const formatHours = function (minutes) {
    const hours = Math.floor((minutes || 0) / 60);
    const mins = (minutes || 0) % 60;
    return hours + 'h ' + mins + 'm';
  };
  const createIcon = function (pathD) {
    return <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d={pathD} /></svg>;
  };
  const MetricCard = function (props) {
    return <div className='bg-white/10 border border-white/20 p-3 sm:p-4 md:p-6 rounded-lg'><div className='flex items-center justify-between'><div className='flex-1'><p className='text-gray-400 text-sm'>{props.title}</p><p className='text-xl sm:text-2xl md:text-3xl font-bold text-white mt-1'>{props.value}</p>{props.subtitle ? <p className='text-gray-400 text-xs mt-1'>{props.subtitle}</p> : null}</div><div className='text-blue-400 ml-4'>{props.icon}</div></div></div>;
  };
  if (loading) {
    return <div className='w-full p-3 sm:p-4 md:p-6 lg:p-8'><div className='flex items-center justify-center py-12'><div className='text-white text-lg'>Loading dashboard...</div></div></div>;
  }
  if (unauthorized) {
    return <div className='w-full p-3 sm:p-4 md:p-6 lg:p-8'><div className='bg-white/10 border border-white/20 p-6 rounded-lg text-center'><p className='text-white'>Please log in to view the dashboard.</p></div></div>;
  }
  if (error) {
    return <div className='w-full p-3 sm:p-4 md:p-6 lg:p-8'><div className='bg-red-500/20 border border-red-500/50 p-6 rounded-lg text-center'><p className='text-red-400'>{error}</p></div></div>;
  }
  const totalProjects = projects.length;
  const activeProjects = projects.filter(function (p) {
    return p.status === 'active' || p.status === 'in_progress';
  }).length;
  const totalTimeMinutes = timeSummary ? timeSummary.total_minutes : 0;
  const billableMinutes = timeSummary ? timeSummary.billable_minutes : 0;
  const totalEarnings = timeSummary ? timeSummary.total_earnings : 0;
  const entriesCount = timeSummary ? timeSummary.entries_count : 0;
  const runningTimers = timeEntries.filter(function (e) {
    return e.is_running;
  }).length;
  const totalInvoiced = invoiceSummary ? invoiceSummary.total_invoiced : 0;
  const totalPaid = invoiceSummary ? invoiceSummary.total_paid : 0;
  const totalOutstanding = invoiceSummary ? invoiceSummary.total_outstanding : 0;
  const overdueCount = invoiceSummary ? invoiceSummary.overdue_count : 0;
  const activeSubscription = subscriptions.find(function (s) {
    return s.status === 'active';
  });
  const teamSize = employees.length;
  const currentTier = activeSubscription ? tiers.find(function (t) {
    return t.id === activeSubscription.tier_id;
  }) : null;
  return <div className='w-full p-3 sm:p-4 md:p-6 lg:p-8'><div className='mb-6 sm:mb-8'><h1 className='text-2xl sm:text-3xl font-bold text-white'>{customer ? "Welcome back" + ', ' + (customer.first_name || 'User') : "Dashboard"}</h1><p className='text-gray-400 mt-1'>Here is your activity overview for the last 30 days</p></div><div className='mb-6 sm:mb-8'><h2 className='text-lg sm:text-xl font-semibold text-white mb-4'>Time Tracking</h2><div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'><MetricCard title='Total Time' value={formatHours(totalTimeMinutes)} icon={createIcon('M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z')} subtitle={entriesCount + ' ' + "entries"} /><MetricCard title='Billable Time' value={formatHours(billableMinutes)} icon={createIcon('M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z')} /><MetricCard title='Earnings' value={formatCurrency(totalEarnings)} icon={createIcon('M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z')} /><MetricCard title='Active Timers' value={runningTimers} icon={createIcon('M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z')} subtitle={runningTimers > 0 ? "Currently running" : "None running"} /></div></div><div className='mb-6 sm:mb-8'><h2 className='text-lg sm:text-xl font-semibold text-white mb-4'>Projects & Team</h2><div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4'><MetricCard title='Total Projects' value={totalProjects} icon={createIcon('M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z')} /><MetricCard title='Active Projects' value={activeProjects} icon={createIcon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z')} /><MetricCard title='Team Members' value={teamSize} icon={createIcon('M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z')} /></div></div><div className='mb-6 sm:mb-8'><h2 className='text-lg sm:text-xl font-semibold text-white mb-4'>Invoices</h2><div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'><MetricCard title='Total Invoiced' value={formatCurrency(totalInvoiced)} icon={createIcon('M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z')} /><MetricCard title='Paid' value={formatCurrency(totalPaid)} icon={createIcon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z')} /><MetricCard title='Outstanding' value={formatCurrency(totalOutstanding)} icon={createIcon('M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z')} /><MetricCard title='Overdue' value={overdueCount} icon={createIcon('M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z')} subtitle={overdueCount > 0 ? "Needs attention" : "All good"} /></div></div><div className='mb-6 sm:mb-8'><h2 className='text-lg sm:text-xl font-semibold text-white mb-4'>Subscription Status</h2><div className='bg-white/10 border border-white/20 p-4 sm:p-6 rounded-lg'>{activeSubscription ? <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'><div><div className='flex items-center gap-3'><div className='text-green-400'>{createIcon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z')}</div><div><p className='text-white font-semibold text-lg'>{currentTier ? currentTier.name : "Active Plan"}</p><p className='text-gray-400 text-sm'>Your subscription is active</p></div></div></div><button className='bg-blue-600 text-white px-4 py-2 rounded' onClick={function () {
            router.push('/my_subscription');
          }}>Manage Subscription</button></div> : <div className='text-center py-4'><div className='text-yellow-400 mb-3'>{createIcon('M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z')}</div><p className='text-white mb-1'>No active subscription</p><p className='text-gray-400 text-sm mb-4'>Upgrade to unlock all features</p><button className='bg-blue-600 text-white px-6 py-2 rounded' onClick={function () {
            router.push('/pricing_plans');
          }}>View Plans</button></div>}</div></div><div><h2 className='text-lg sm:text-xl font-semibold text-white mb-4'>Quick Actions</h2><div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'><button className='bg-white/10 border border-white/20 p-3 sm:p-4 rounded-lg text-left' onClick={function () {
          router.push('/time_tracker');
        }}><div className='flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-3'><div className='text-blue-400'>{createIcon('M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z')}</div><span className='text-white text-sm sm:text-base text-center sm:text-left'>Track Time</span></div></button><button className='bg-white/10 border border-white/20 p-3 sm:p-4 rounded-lg text-left' onClick={function () {
          router.push('/my_projects');
        }}><div className='flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-3'><div className='text-green-400'>{createIcon('M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z')}</div><span className='text-white text-sm sm:text-base text-center sm:text-left'>Projects</span></div></button><button className='bg-white/10 border border-white/20 p-3 sm:p-4 rounded-lg text-left' onClick={function () {
          router.push('/invoices');
        }}><div className='flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-3'><div className='text-yellow-400'>{createIcon('M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z')}</div><span className='text-white text-sm sm:text-base text-center sm:text-left'>Invoices</span></div></button><button className='bg-white/10 border border-white/20 p-3 sm:p-4 rounded-lg text-left' onClick={function () {
          router.push('/task_board');
        }}><div className='flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-3'><div className='text-purple-400'>{createIcon('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4')}</div><span className='text-white text-sm sm:text-base text-center sm:text-left'>Tasks</span></div></button></div></div></div>;
}