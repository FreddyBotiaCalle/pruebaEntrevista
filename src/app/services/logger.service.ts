import { Injectable } from '@angular/core';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private isDevelopment = true;

  constructor() {}

  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, error?: any): void {
    this.log(LogLevel.ERROR, message, error);
  }

  private log(level: LogLevel, message: string, data?: any): void {
    if (!this.isDevelopment) return;

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, data);
        break;
      case LogLevel.INFO:
        console.info(logMessage, data);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, data);
        break;
      case LogLevel.ERROR:
        console.error(logMessage, data);
        break;
    }
  }
}
