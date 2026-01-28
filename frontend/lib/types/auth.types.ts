import { User } from "firebase/auth";

export interface UserPermissions {
  userId: string;
  email: string;
  isAdmin: boolean;
  pillars: {
    pillar1: boolean; // Strategy & Value Realization
    pillar2: boolean; // Innovation & IP Development
    pillar3: boolean; // Platforms & Engineering
    pillar4: boolean; // People & Capability Enablement
    pillar5: boolean; // COE Delivery Governance
    pillar6: boolean; // Communication & Market Intelligence
    pillar7: boolean; // Internal AI Adoption & Automation
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  permissions: UserPermissions | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  hasAccessToPillar: (pillarNumber: number) => boolean;
}

export interface PillarInfo {
  id: string;
  number: number;
  name: string;
  description: string;
  url: string;
  accentColor: string;
  enabled: boolean;
  image?: string;
}
