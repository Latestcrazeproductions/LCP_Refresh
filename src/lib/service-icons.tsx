import { Monitor, Zap, Mic2, Layers, Boxes, Projector } from 'lucide-react';

export const SERVICE_ICON_MAP = {
  monitor: Monitor,
  zap: Zap,
  mic2: Mic2,
  layers: Layers,
  boxes: Boxes,
  projector: Projector,
} as const;

export function getServiceIcon(iconKey: string) {
  return SERVICE_ICON_MAP[iconKey as keyof typeof SERVICE_ICON_MAP];
}
