import type {
  Logger,
  LoggerChildBindings,
  LoggerEntry,
  LoggerErrorInfo,
  LoggerLogOptions,
} from '@/types';

const history: LoggerEntry[] = [];

function normalizeError(error: unknown): LoggerErrorInfo | undefined {
  if (!error) return undefined;
  if (error instanceof Error) return { name: error.name, message: error.message, stack: error.stack };
  return { message: String(error) };
}

export function createLogger(bindings: LoggerChildBindings = {}): Logger {
  const log = (level: LoggerEntry['level'], message: string, options: LoggerLogOptions = {}) => {
    const entry: LoggerEntry = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      level,
      message,
      scope: options.scope ?? bindings.scope ?? 'app',
      tags: { ...(bindings.tags ?? {}), ...(options.tags ?? {}) },
      context: { ...(bindings.context ?? {}), ...(options.context ?? {}) },
      error: normalizeError(options.error),
    };
    history.push(entry);
    if (history.length > 200) history.shift();
    if (import.meta.env.DEV || level === 'error' || level === 'warn') {
      const method = level === 'trace' || level === 'debug' ? 'debug' : level;
      console[method](entry.message, { scope: entry.scope, tags: entry.tags, context: entry.context, error: entry.error });
    }
  };

  return {
    trace: (message, options) => log('trace', message, options),
    debug: (message, options) => log('debug', message, options),
    info: (message, options) => log('info', message, options),
    warn: (message, options) => log('warn', message, options),
    error: (message, options) => log('error', message, options),
    child: (childBindings) => createLogger({
      scope: childBindings.scope ?? bindings.scope,
      tags: { ...(bindings.tags ?? {}), ...(childBindings.tags ?? {}) },
      context: { ...(bindings.context ?? {}), ...(childBindings.context ?? {}) },
    }),
    getHistory: () => [...history],
    clearHistory: () => { history.length = 0; },
  };
}
