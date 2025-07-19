import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import kleur from 'kleur';

// Custom timestamp formatter
const formatTimestamp = () => {
  const now = new Date();
  const date = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const ms = now.getMilliseconds().toString().padStart(3, '0');
  return `[${date} ${time}.${ms}]`;
};

// Create custom morgan token for response time in milliseconds
morgan.token('response-time', (req: Request, res: Response) => {
  if (!res.header) return '0';
  const startTime = (req as any).startAt;
  if (!startTime) return '0';
  const diff = process.hrtime(startTime);
  const ms = diff[0] * 1e3 + diff[1] * 1e-6;
  return ms.toFixed(2);
});

// Create the logger middleware
export const logger = morgan(':method :url :status :response-time', {
  stream: {
    write: (message: string) => {
      const [method, url, status, responseTime] = message.trim().split(' ');
      const timestamp = formatTimestamp();

      // Color coding based on status
      const statusColor = 
        Number(status) >= 500 ? kleur.red :
        Number(status) >= 400 ? kleur.yellow :
        Number(status) >= 300 ? kleur.cyan :
        Number(status) >= 200 ? kleur.green :
        kleur.white;

      // Color coding based on method
      const methodColor = 
        method === 'GET' ? kleur.blue :
        method === 'POST' ? kleur.green :
        method === 'PUT' ? kleur.yellow :
        method === 'DELETE' ? kleur.red :
        kleur.white;

      console.log([
        kleur.gray(timestamp),
        methodColor(method?.padEnd(7) || '-'),
        kleur.gray(url),
        statusColor(status),
      ].join(' '));
    },
  },
});

// Custom console logger for non-HTTP logs
export const log = {
  info: (message: string, ...args: any[]) => {
    console.log(kleur.gray(formatTimestamp()), kleur.blue('INFO'), message, ...args);
  },
  success: (message: string, ...args: any[]) => {
    console.log(kleur.gray(formatTimestamp()), kleur.green('SUCCESS'), message, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.log(kleur.gray(formatTimestamp()), kleur.yellow('WARN'), message, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.log(kleur.gray(formatTimestamp()), kleur.red('ERROR'), message, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(kleur.gray(formatTimestamp()), kleur.cyan('DEBUG'), message, ...args);
    }
  },
};

// Backward compatibility - alias for existing code
export const Logger = log;
export const requestLogger = logger;
export const requestIdMiddleware = (req: any, res: any, next: any) => {
  req.id = Math.random().toString(36).substring(2, 15);
  res.setHeader('X-Request-ID', req.id);
  next();
}; 