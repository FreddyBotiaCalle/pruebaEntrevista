import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../core/constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config = {
    appName: APP_CONSTANTS.APP_NAME,
    appVersion: APP_CONSTANTS.APP_VERSION,
    isDevelopment: !this.isProduction(),
    isProduction: this.isProduction(),
  };

  constructor() {}

  getConfig() {
    return this.config;
  }

  getAppName(): string {
    return this.config.appName;
  }

  getAppVersion(): string {
    return this.config.appVersion;
  }

  isDevelopment(): boolean {
    return this.config.isDevelopment;
  }

  isProduction(): boolean {
    return false; // En producción, esto vendría del environment
  }
}
