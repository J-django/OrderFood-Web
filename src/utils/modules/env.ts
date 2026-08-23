const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

export const clientEnv = {
  apiBaseUrl,
  appName: import.meta.env.VITE_APP_NAME || '饭香香',
  appTitle: import.meta.env.VITE_APP_TITLE || '饭香香',
  appVersion: import.meta.env.VITE_APP_VERSION || '0.0.0',
  isProduction: import.meta.env.PROD,
  runtimeEnv: import.meta.env.MODE,
  monitoringEnabled:
    import.meta.env.PROD && import.meta.env.VITE_MONITORING_ENABLED !== 'false',
  monitoringEndpoint: import.meta.env.VITE_MONITORING_ENDPOINT || '/monitoring/events',
  monitoringSampleRate: Number(import.meta.env.VITE_MONITORING_SAMPLE_RATE || 1),
};
