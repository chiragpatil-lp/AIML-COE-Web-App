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

export function PillarGrid() {
  const { hasAccessToPillar, permissions } = useAuth();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {PILLARS.map((pillar) => {
        const hasAccess = hasAccessToPillar(pillar.number);

        return (
          <div
            key={pillar.id}
            className={`card bg-base-100 shadow-xl relative overflow-hidden transition-all ${
              hasAccess
                ? 'hover:shadow-2xl cursor-pointer'
                : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={() => {
              if (hasAccess && pillar.url !== '#') {
                window.open(pillar.url, '_blank');
              }
            }}
          >
            {/* Accent border */}
            <div
              className="absolute top-0 left-0 w-1 h-full"
              style={{ backgroundColor: pillar.accentColor }}
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
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
                  <div className="badge badge-ghost badge-sm">Access not granted</div>
                )}
                {permissions?.isAdmin && (
                  <div className="badge badge-success badge-sm">Admin Access</div>
                )}
                {hasAccess && !permissions?.isAdmin && (
                  <div className="badge badge-primary badge-sm">Authorized</div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
