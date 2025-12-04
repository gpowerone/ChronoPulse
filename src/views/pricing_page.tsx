'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const router = useRouter();
  const [tiers, setTiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subscribingTier, setSubscribingTier] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const loadTiers = async () => {
      try {
        const response = await fetch('/api/tierslist?enabled=true', {
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
        setError('Failed to load pricing plans');
      } finally {
        setIsLoading(false);
      }
    };
    loadTiers();
  }, []);
  const handleSubscribe = async tier => {
    if (!tier.stripe_price_id || tier.price === 0) {
      router.push('/signup');
      return;
    }
    if (tier.slug === 'enterprise' && !tier.stripe_price_id) {
      router.push('/contact');
      return;
    }
    setSubscribingTier(tier.id);
    setError('');
    try {
      const response = await fetch('/api/subscription_create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          price_id: tier.stripe_price_id,
          trial_days: tier.trial_days || 0
        })
      });
      if (response.status === 401) {
        setError("Please log in to subscribe");
        setSubscribingTier(null);
        return;
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create subscription');
      }
      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError("Something went wrong. Please try again.");
      setSubscribingTier(null);
    }
  };
  const getButtonText = tier => {
    if (tier.price === 0 || !tier.stripe_price_id) {
      return "Get Started";
    }
    if (tier.slug === 'enterprise' && !tier.stripe_price_id) {
      return "Contact Sales";
    }
    return "Subscribe";
  };
  if (isLoading) {
    return <div className='flex justify-center items-center min-h-[400px]'><div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600' /></div>;
  }
  return <div className='pricing-container py-16 px-4 sm:px-6 lg:px-8'><div className='text-center mb-16'><h1 className='text-4xl font-bold mb-4'>Choose Your Plan</h1><p className='text-xl opacity-90 max-w-2xl mx-auto'>Start free, upgrade when you're ready</p></div>{error && <div className='max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center'>{error}</div>}{tiers.length === 0 && !error && <div className='text-center py-16'><p className='text-lg opacity-90'>No pricing plans available yet.</p></div>}{tiers.length > 0 && <div className={`grid grid-cols-1 gap-8 max-w-7xl mx-auto ${tiers.length === 1 ? 'md:max-w-md' : tiers.length === 2 ? 'md:grid-cols-2 md:max-w-3xl' : tiers.length === 3 ? 'md:grid-cols-3 md:max-w-5xl' : 'md:grid-cols-2 lg:grid-cols-4'}`}>{tiers.map(tier => <div key={tier.id} className={`relative rounded-2xl border-2 p-8 flex flex-col ${tier.is_featured ? 'border-blue-500 shadow-xl scale-105' : 'border-gray-200'}`}>{tier.is_featured && <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'><span className='bg-blue-500 text-white text-sm font-medium px-4 py-1 rounded-full'>Most Popular</span></div>}<h3 className='text-xl font-semibold mb-4'>{tier.name}</h3><div className='mb-6'>{tier.price > 0 ? <span className='flex items-baseline'><span className='text-4xl font-bold'>{`$${parseFloat(tier.price).toFixed(tier.price % 1 === 0 ? 0 : 2)}`}</span><span className='ml-1 opacity-90'>{tier.billing_period === 'yearly' ? '/year' : "/month"}</span></span> : <span className='text-4xl font-bold'>{tier.slug === 'enterprise' ? 'Custom' : "Free"}</span>}</div>{tier.description && <p className='text-sm opacity-90 mb-6'>{tier.description}</p>}{tier.features && tier.features.length > 0 && <ul className='space-y-3 mb-8 flex-grow'>{tier.features.map((feature, index) => <li key={index} className='flex items-center'><svg className='w-5 h-5 text-green-500 mr-3 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' /></svg><span className='opacity-90'>{feature}</span></li>)}</ul>}{tier.trial_days > 0 && <p className='text-sm text-blue-600 font-medium mb-4'>{`${tier.trial_days}-day free trial`}</p>}<button onClick={() => handleSubscribe(tier)} disabled={subscribingTier === tier.id} className={`w-full py-3 px-4 rounded-lg font-medium ${subscribingTier === tier.id ? 'opacity-50 cursor-not-allowed' : ''}`}>{subscribingTier === tier.id ? "Processing..." : getButtonText(tier)}</button></div>)}</div>}<div className='text-center mt-16 opacity-90'><p>All paid plans include a free trial. Cancel anytime.</p></div></div>;
}