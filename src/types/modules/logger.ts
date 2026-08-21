export type LoggerLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';
export type LoggerTagValue = string | number | boolean | null;
export type LoggerTags = Record<string, LoggerTagValue>;
export type LoggerContext = Record<string, unknown>;
export type LoggerErrorInfo = { name?: string; message: string; stack?: string };
export type LoggerLogOptions = {
  scope?: string;
  tags?: LoggerTags;
  context?: LoggerContext;
  error?: unknown;
  dedupeKey?: string;
};
export type LoggerChildBindings = {
  scope?: string;
  tags?: LoggerTags;
  context?: LoggerContext;
};
export type LoggerEntry = {
  id: string;
  timestamp: string;
  level: Exclude<LoggerLevel, 'silent'>;
  message: string;
  scope: string;
  tags: LoggerTags;
  context?: LoggerContext;
  error?: LoggerErrorInfo;
};
export type Logger = {
  trace: (message: string, options?: LoggerLogOptions) => void;
  debug: (message: string, options?: LoggerLogOptions) => void;
  info: (message: string, options?: LoggerLogOptions) => void;
  warn: (message: string, options?: LoggerLogOptions) => void;
  error: (message: string, options?: LoggerLogOptions) => void;
  child: (bindings: LoggerChildBindings) => Logger;
  getHistory: () => LoggerEntry[];
  clearHistory: () => void;
};
