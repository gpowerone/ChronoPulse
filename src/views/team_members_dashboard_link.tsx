import React from 'react';

interface GeneratedTeamMembersDashboardLinkViewProps {
  isContainer?: boolean;
}

export default function GeneratedTeamMembersDashboardLinkView({ isContainer = false }: GeneratedTeamMembersDashboardLinkViewProps){
  return (
      <div className="rtext-content" dangerouslySetInnerHTML={{__html: "<a href=\"javascript:void(0)\" onclick=\"window.postMessage({ 'navigate': '0c04644b-0ee2-43b8-adf1-8fa166df8625' })\" style=\"color: #6366f1; text-decoration: none; font-family: Inter; font-size: 0.875rem; transition: color 0.2s;\">← Back to Dashboard</a>" }} />
  );
}