
import { TeamMember } from './types';

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Namburi Rishika",
    role: "Team Lead",
    contact: "8988483666",
    image: "https://picsum.photos/seed/rishika/300/400"
  },
  {
    name: "Nooka Nikshith",
    role: "Team Mate - 1",
    contact: "8309065513",
    image: "https://picsum.photos/seed/nikshith/300/400"
  },
  {
    name: "Pacha Likhitha Sai",
    role: "Team Mate - 2",
    contact: "8019759223",
    image: "https://picsum.photos/seed/sai/300/400"
  },
  {
    name: "Ambadasu Amshuman",
    role: "Team Mate - 3",
    contact: "9391867520",
    image: "https://picsum.photos/seed/amshuman/300/400"
  }
];

export const AQI_LEVELS = {
  Good: { color: '#10b981', range: [0, 50] },
  Moderate: { color: '#fbbf24', range: [51, 100] },
  Unhealthy: { color: '#f97316', range: [101, 200] },
  'Very Unhealthy': { color: '#ef4444', range: [201, 300] },
  Hazardous: { color: '#7f1d1d', range: [301, 500] }
};
