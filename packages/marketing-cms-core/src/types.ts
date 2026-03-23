import { z } from 'zod';

export type SiteContentValue = Record<string, unknown>;

export interface CMSConfig {
  siteId: string;
  sections: Record<string, z.ZodTypeAny>;
  defaults: Record<string, any>;
}

export interface CMSContextType {
  content: Record<string, any>;
  config: CMSConfig;
}
