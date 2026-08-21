export type MonitoringLevel = 'info' | 'warning' | 'error' | 'fatal';
export type MonitoringTags = Record<string, string | number | boolean | null>;
export type MonitoringExtra = Record<string, unknown>;
export type MonitoringBreadcrumb = {
  timestamp: string;
  category: string;
  message: string;
  level?: MonitoringLevel;
  data?: MonitoringExtra;
};
export type MonitoringEventInput = {
  requestId?: string;
  level?: MonitoringLevel;
  category: string;
  subtype: string;
  message: string;
  tags?: MonitoringTags;
  extra?: MonitoringExtra;
  error?: unknown;
};
