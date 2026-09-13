import { ProvenanceMeta } from '../types';

export function createProvenance(
  source: string,
  recordId?: string,
  options?: {
    sourceUrl?: string;
    query?: string;
    isExperimental?: boolean;
    isPredicted?: boolean;
    isDemo?: boolean;
  }
): ProvenanceMeta {
  return {
    source,
    recordId,
    timestamp: new Date().toISOString(),
    sourceUrl: options?.sourceUrl,
    query: options?.query,
    isExperimental: options?.isExperimental ?? false,
    isPredicted: options?.isPredicted ?? false,
    isDemo: options?.isDemo ?? false,
  };
}
