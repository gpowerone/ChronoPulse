'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import RCTA from '../components/cta';

export default function GeneratedHeroContentView() {
  const router = useRouter();
  const customViewDescription = "{\"headline\":\"Master Your Time, Amplify Your Productivity\",\"subheader\":\"ChronoPulse transforms how teams track, analyze, and optimize work hours with intelligent, seamless time management\",\"buttons\":[{\"buttonTitle\":\"Start Free Trial\",\"page\":\"a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d\"}],\"headlineStyle\":{\"fontFamily\":\"Outfit\",\"color\":\"#ffffff\",\"fontSize\":\"text-5xl md:text-7xl lg:text-8xl\",\"fontWeight\":\"800\"},\"subheaderStyle\":{\"fontFamily\":\"Inter\",\"color\":\"#e5e5e5\",\"fontSize\":\"text-xl md:text-2xl\"},\"buttonStyle\":{\"fontFamily\":\"Outfit\",\"color\":\"#ffffff\",\"backgroundColor\":\"#6366f1\",\"rounded\":\"rounded-full\"}}";
  
  const handleNavigate = (pageId: string) => {
    if (!pageId) return;
    
    // Find the page using the pageId and navigate to it
    const pages = [{"id":"a0941b97-c5e0-4266-ab87-a660f7993cf4","name":"Home"},{"id":"a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d","name":"Pricing Plans"},{"id":"b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e","name":"My Subscription"},{"id":"c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f","name":"Manage Tiers"},{"id":"c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f","name":"Customer Management"},{"id":"employees-admin-page","name":"Team Directory"},{"id":"projects-list-page","name":"My Projects"},{"id":"project-detail-page","name":"Project Workspace"},{"id":"project-member-component","name":"Team Members"},{"id":"time-tracking-page","name":"Time Tracker"},{"id":"invoices-admin-page","name":"Invoices"},{"id":"e3b1d0e3-d65a-4817-a906-83d5956e4f67","name":"Task Board"},{"id":"eb929113-8e70-40ff-aeb7-ba4ec134730f","name":"About TimeFlow"},{"id":"604c7053-c843-4746-996c-8bc0f490e674","name":"FAQ"},{"id":"0c04644b-0ee2-43b8-adf1-8fa166df8625","name":"Dashboard"},{"id":"61d8f02c-561b-4f3e-801d-456ca687b6c6","name":"Admin Dashboard"},{"id":"87581da8-be6a-4fdb-a330-2d6087f54877","name":"Login"},{"id":"908ede16-7408-4e4d-ae69-683ba1b7e14c","name":"Terms of Service"},{"id":"a3eafc3d-6db8-44ea-bdce-dba850f60e54","name":"Privacy Policy"}];
    const page = pages.find(p => p.id === pageId);
    if (page) {
      // Use page name for URL, replace non-alphanumeric with underscore
      let folderName = page.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
      
      // Replace multiple consecutive underscores with a single underscore
      folderName = folderName.replace(/_+/g, '_');
      
      // Remove leading and trailing underscores
      folderName = folderName.replace(/^_+|_+$/g, '');
      
      // If empty or just 'home', use root
      if (!folderName || folderName === 'home') {
        router.push('/');
      } else {
        router.push('/' + folderName);
      }
    }
  };
  
  return <RCTA custom_view_description={customViewDescription} onNavigate={handleNavigate} />;
}