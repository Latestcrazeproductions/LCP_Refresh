import { z } from 'zod';
import { CMSConfig } from './types';

export function mergeContent(
  dbValues: Record<string, any>,
  config: CMSConfig
): Record<string, any> {
  const merged: Record<string, any> = { ...config.defaults };

  for (const [key, schema] of Object.entries(config.sections)) {
    const dbValue = dbValues[key];
    const defaultValue = config.defaults[key];

    if (dbValue !== undefined) {
      try {
        // Attempt to parse and validate
        const parsed = schema.parse(dbValue);
        merged[key] = parsed;
      } catch (err) {
        console.warn(`CMS validation failed for key "${key}", falling back to default.`, err);
        merged[key] = defaultValue;
      }
    } else {
      merged[key] = defaultValue;
    }
  }

  return merged;
}
