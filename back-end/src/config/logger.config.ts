import morgan from 'morgan'
import fs from 'fs'
import path from 'path'

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

// Create log streams
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
)

const errorLogStream = fs.createWriteStream(
  path.join(logsDir, 'error.log'),
  { flags: 'a' }
)

// Custom morgan tokens
morgan.token('id', (req: any) => req.id)
morgan.token('real-ip', (req: any) => {
  return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         (req.connection.socket ? req.connection.socket.remoteAddress : null)
})
morgan.token('user', (req: any) => {
  return req.user ? req.user.email : 'anonymous'
})
morgan.token('body', (req: any) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    // Don't log sensitive information
    const body = { ...req.body }
    if (body.password) body.password = '[REDACTED]'
    if (body.token) body.token = '[REDACTED]'
    return JSON.stringify(body)
  }
  return ''
})

// Log formats
const developmentFormat = morgan.compile(':method :url :status :response-time ms - :res[content-length] - :real-ip - :user')

const productionFormat = morgan.compile(
  ':real-ip - :user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms'
)

const detailedFormat = morgan.compile(
  ':id :real-ip - :user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms :body'
)

// Error format for failed requests
const errorFormat = morgan.compile(
  '[:date[clf]] ERROR :method :url :status :response-time ms - :real-ip - :user - :body'
)

// Morgan middleware configurations
export const developmentLogger = morgan(developmentFormat, {
  stream: process.stdout
})

export const productionLogger = morgan(productionFormat, {
  stream: accessLogStream,
  skip: (req, res) => res.statusCode < 400
})

export const detailedLogger = morgan(detailedFormat, {
  stream: accessLogStream
})

export const errorLogger = morgan(errorFormat, {
  stream: errorLogStream,
  skip: (req, res) => res.statusCode < 400
})

// Combined logger for different environments
export const requestLogger = process.env.NODE_ENV === 'production' 
  ? [productionLogger, errorLogger]
  : [developmentLogger]

// Console logger utility
export class Logger {
  private static formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString()
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`
  }

  static info(message: string, meta?: any): void {
    console.log(this.formatMessage('info', message, meta))
    this.writeToFile('info', message, meta)
  }

  static warn(message: string, meta?: any): void {
    console.warn(this.formatMessage('warn', message, meta))
    this.writeToFile('warn', message, meta)
  }

  static error(message: string, error?: Error | any, meta?: any): void {
    const errorInfo = error instanceof Error 
      ? { name: error.name, message: error.message, stack: error.stack }
      : error

    const fullMeta = { ...meta, error: errorInfo }
    console.error(this.formatMessage('error', message, fullMeta))
    this.writeToFile('error', message, fullMeta)
  }

  static debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true') {
      console.debug(this.formatMessage('debug', message, meta))
      this.writeToFile('debug', message, meta)
    }
  }

  private static writeToFile(level: string, message: string, meta?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      meta
    }

    const logLine = JSON.stringify(logEntry) + '\n'
    
    const logFile = level === 'error' ? 'error.log' : 'app.log'
    const logPath = path.join(logsDir, logFile)
    
    fs.appendFile(logPath, logLine, (err) => {
      if (err) console.error('Failed to write to log file:', err)
    })
  }

  // Database query logger
  static database(query: string, duration?: number, error?: Error): void {
    const meta = { query, duration, error }
    
    if (error) {
      this.error('Database query failed', error, { query, duration })
    } else {
      this.debug('Database query executed', meta)
    }
  }

  // Auth logger
  static auth(action: string, email?: string, success: boolean = true, meta?: any): void {
    const message = `Authentication ${action}: ${email || 'unknown'}`
    const logMeta = { action, email, success, ...meta }
    
    if (success) {
      this.info(message, logMeta)
    } else {
      this.warn(message, logMeta)
    }
  }

  // File upload logger
  static upload(filename: string, size: number, type: string, success: boolean = true, error?: Error): void {
    const message = `File upload ${success ? 'successful' : 'failed'}: ${filename}`
    const meta = { filename, size, type, error }
    
    if (success) {
      this.info(message, meta)
    } else {
      this.error(message, error, { filename, size, type })
    }
  }

  // API request logger for custom tracking
  static apiRequest(method: string, url: string, userId?: string, duration?: number): void {
    const message = `API Request: ${method} ${url}`
    const meta = { method, url, userId, duration }
    this.debug(message, meta)
  }

  // Security logger for suspicious activities
  static security(event: string, ip: string, userAgent?: string, meta?: any): void {
    const message = `Security event: ${event}`
    const logMeta = { event, ip, userAgent, ...meta }
    this.warn(message, logMeta)
  }

  // Performance logger
  static performance(operation: string, duration: number, meta?: any): void {
    const message = `Performance: ${operation} took ${duration}ms`
    const logMeta = { operation, duration, ...meta }
    
    if (duration > 5000) { // Log slow operations as warnings
      this.warn(message, logMeta)
    } else {
      this.debug(message, logMeta)
    }
  }
}

// Request ID middleware to track requests
export const requestIdMiddleware = (req: any, res: any, next: any) => {
  req.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  res.setHeader('X-Request-ID', req.id)
  next()
}

// Log rotation utility (simple version)
export const rotateLog = (filename: string) => {
  const logPath = path.join(logsDir, filename)
  const archivePath = path.join(logsDir, `${filename}.${Date.now()}`)
  
  if (fs.existsSync(logPath)) {
    const stats = fs.statSync(logPath)
    // Rotate if file is larger than 10MB
    if (stats.size > 10 * 1024 * 1024) {
      fs.renameSync(logPath, archivePath)
      Logger.info(`Log rotated: ${filename} -> ${path.basename(archivePath)}`)
    }
  }
}

// Clean old log files (keep logs for 30 days)
export const cleanOldLogs = () => {
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
  
  fs.readdir(logsDir, (err, files) => {
    if (err) return
    
    files.forEach(file => {
      const filePath = path.join(logsDir, file)
      fs.stat(filePath, (err, stats) => {
        if (err) return
        
        if (stats.mtime.getTime() < thirtyDaysAgo) {
          fs.unlink(filePath, (err) => {
            if (!err) Logger.info(`Old log file deleted: ${file}`)
          })
        }
      })
    })
  })
}

// Initialize log rotation and cleanup (run periodically)
if (process.env.NODE_ENV === 'production') {
  // Rotate logs daily
  setInterval(() => {
    rotateLog('access.log')
    rotateLog('error.log')
    rotateLog('app.log')
  }, 24 * 60 * 60 * 1000)

  // Clean old logs weekly
  setInterval(() => {
    cleanOldLogs()
  }, 7 * 24 * 60 * 60 * 1000)
}

// Export configuration
export const LOGGER_CONFIG = {
  LOGS_DIR: logsDir,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  FILE_ROTATION: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_AGE: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
} as const 