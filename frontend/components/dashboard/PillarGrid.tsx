'use client';

import { useAuth } from '@/contexts/AuthContext';
import type { PillarInfo } from '@/lib/types/auth.types';

const PILLARS: PillarInfo[] = [
  {
    id: 'strategy',
    number: 1,
    name: 'Strategy & Value Realization',
    description: 'ROI tracking, leadership dashboards, and impact metrics',
    url: process.env.NEXT_PUBLIC_PILLAR_1_URL || '#',
    accentColor: '#f2545b',
    enabled: true,
  },
  {
    id: 'innovation',
    number: 2,
    name: 'Innovation & IP Development',
    description: 'AI accelerators, frameworks, and enterprise assets',
    url: process.env.NEXT_PUBLIC_PILLAR_2_URL || '#',
    accentColor: '#2c3e50',
    enabled: true,
  },
  {
    id: 'platforms',
    number: 3,
    name: 'Platforms & Engineering',
    description: 'Trusted tools, templates, and standards',
    url: process.env.NEXT_PUBLIC_PILLAR_3_URL || '#',
    accentColor: '#f2545b',
    enabled: true,
  },
  {
    id: 'people',
    number: 4,
    name: 'People & Capability Enablement',
    description: 'Skills development, training, and maturity assessment',
    url: process.env.NEXT_PUBLIC_PILLAR_4_URL || '#',
    accentColor: '#2c3e50',
    enabled: true,
  },
  {
    id: 'governance',
    number: 5,
    name: 'COE Delivery Governance',
    description: 'Quality assurance and continuous improvement',
    url: process.env.NEXT_PUBLIC_PILLAR_5_URL || '#',
    accentColor: '#f2545b',
    enabled: true,
  },
  {
    id: 'communication',
    number: 6,
    name: 'Communication & Market Intelligence',
    description: 'Market insights, AI trends, and COE showcase',
    url: process.env.NEXT_PUBLIC_PILLAR_6_URL || '#',
    accentColor: '#2c3e50',
    enabled: true,
  },
];

interface PillarGridProps {
  // No props currently, but interface defined for future extensibility
}

export function PillarGrid(_props: PillarGridProps = {}) {
  const { hasAccessToPillar, permissions, user } = useAuth();

  const handlePillarClick = async (pillar: PillarInfo, hasAccess: boolean) => {
    if (!hasAccess || pillar.url === '#') {
      return;
    }

    try {
      // Get the user's ID token for server-side verification
      const token = await user?.getIdToken();

      if (!token) {
        console.error('Failed to get authentication token');
        return;
      }

      // Use the secure API endpoint instead of direct URL access
      const apiUrl = `/api/pillar/${pillar.number}`;

      // Open in new tab with the API endpoint that will verify and redirect
      window.open(apiUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error accessing pillar:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {PILLARS.map((pillar) => {
        const hasAccess = hasAccessToPillar(pillar.number);

        return (
          <button
            key={pillar.id}
            className={`card bg-base-100 shadow-xl relative overflow-hidden transition-all text-left ${
              hasAccess
                ? 'hover:shadow-2xl cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none'
                : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={() => handlePillarClick(pillar, hasAccess)}
            disabled={!hasAccess || pillar.url === '#'}
            aria-label={`${pillar.name} - ${hasAccess ? 'Click to open' : 'Access not granted'}`}
            aria-disabled={!hasAccess}
            type="button"
          >
            {/* Accent border */}
            <div
              className="absolute top-0 left-0 w-1 h-full"
              style={{ backgroundColor: pillar.accentColor }}
              aria-hidden="true"
            />

            <div className="card-body pl-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="card-title text-lg mb-2">{pillar.name}</h2>
                  <p className="text-sm text-base-content/70">{pillar.description}</p>
                </div>
                {hasAccess && pillar.url !== '#' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                )}
              </div>

              <div className="card-actions justify-start mt-2">
                {!hasAccess && (
                  <div className="badge badge-ghost badge-sm" aria-label="Access status: not granted">
                    Access not granted
                  </div>
                )}
                {permissions?.isAdmin && (
                  <div className="badge badge-success badge-sm" aria-label="Access level: admin">
                    Admin Access
                  </div>
                )}
                {hasAccess && !permissions?.isAdmin && (
                  <div className="badge badge-primary badge-sm" aria-label="Access status: authorized">
                    Authorized
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
