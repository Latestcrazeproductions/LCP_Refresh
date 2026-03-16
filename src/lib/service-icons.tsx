import { Monitor, Zap, Mic2, Layers, Boxes, Projector, Package, Award, Users, Sparkles } from 'lucide-react';

export const SERVICE_ICON_MAP = {
  monitor: Monitor,
  zap: Zap,
  mic2: Mic2,
  layers: Layers,
  boxes: Boxes,
  projector: Projector,
  package: Package,
  award: Award,
  users: Users,
  sparkles: Sparkles,
} as const;

export function getServiceIcon(iconKey: string) {
  return SERVICE_ICON_MAP[iconKey as keyof typeof SERVICE_ICON_MAP];
}
