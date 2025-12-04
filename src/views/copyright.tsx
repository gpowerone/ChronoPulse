import React from 'react';

interface GeneratedCopyrightViewProps {
  isContainer?: boolean;
}

export default function GeneratedCopyrightView({ isContainer = false }: GeneratedCopyrightViewProps){
  return (
      <div className="rtext-content" dangerouslySetInnerHTML={{__html: "© 2025 ChronoPulse. All rights reserved." }} />
  );
}