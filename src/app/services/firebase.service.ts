import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getRemoteConfig, fetchAndActivate } from 'firebase/remote-config';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private initialized = false;
  private remoteConfig: any;
  private featureFlags$ = new BehaviorSubject<any>({
    categoriesEnabled: true,
    maxTodosPerUser: 100,
    enableNotifications: true,
    maintenanceMode: false,
  });

  // ⚠️ IMPORTANTE: Reemplaza estos valores con tus credenciales de Firebase
  // Ve a https://console.firebase.google.com → Tu proyecto → Configuración → General
  // y copia los valores de tu aplicación web
  private firebaseConfig = {
    apiKey: 'AIzaSyCLwxf-W2ieHuoWIYs73Q4VewILCAixTXw',
    authDomain: 'pruebaentrevista-e591d.firebaseapp.com',
    projectId: 'pruebaentrevista-e591d',
    storageBucket: 'pruebaentrevista-e591d.firebasestorage.app',
    messagingSenderId: '248283337286',
    appId: '1:248283337286:web:d58400b7507b0a9fe5f047',
    measurementId: 'G-57PV2J46T7',
  };

  // Valores por defecto para los feature flags
  private defaultConfig = {
    categoriesEnabled: true,
    maxTodosPerUser: 100,
    enableNotifications: true,
    maintenanceMode: false,
  };

  constructor(private logger: LoggerService) {}

  /**
   * Inicializa Firebase y Remote Config
   */
  async initialize(): Promise<void> {
    try {
      if (this.initialized) {
        this.logger.info('Firebase ya está inicializado');
        return;
      }

      // Verificar si la configuración ha sido actualizada
      if (
        this.firebaseConfig.apiKey === 'YOUR_API_KEY_HERE' ||
        this.firebaseConfig.projectId === 'YOUR_PROJECT_ID_HERE'
      ) {
        this.logger.warn(
          'Firebase no está configurado. Usando valores por defecto. Ve a FIREBASE_SETUP.md para configurar.'
        );
        this.featureFlags$.next(this.defaultConfig);
        this.initialized = true;
        return;
      }

      // Inicializar Firebase
      this.logger.info('Inicializando Firebase');
      const firebaseApp = initializeApp(this.firebaseConfig);

      // Inicializar Remote Config
      this.remoteConfig = getRemoteConfig(firebaseApp);
      this.remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hora
      this.remoteConfig.settings.fetchTimeoutMillis = 60000; // 60 segundos

      // Establecer valores por defecto
      this.remoteConfig.defaultConfig = this.defaultConfig;

      // Cargar configuración remota
      await this.loadRemoteConfig();

      this.initialized = true;
      this.logger.info('Firebase inicializado correctamente');
    } catch (error) {
      this.logger.error('Error inicializando Firebase', error);
      // Usar valores por defecto si hay error
      this.featureFlags$.next(this.defaultConfig);
      this.initialized = true;
    }
  }

  /**
   * Carga la configuración remota desde Firebase
   */
  async loadRemoteConfig(): Promise<void> {
    try {
      if (!this.remoteConfig) {
        this.featureFlags$.next(this.defaultConfig);
        return;
      }

      this.logger.info('Cargando Remote Config');
      await fetchAndActivate(this.remoteConfig);

      const flags = {
        categoriesEnabled: this.remoteConfig.getBoolean('categoriesEnabled'),
        maxTodosPerUser: this.remoteConfig.getNumber('maxTodosPerUser'),
        enableNotifications: this.remoteConfig.getBoolean('enableNotifications'),
        maintenanceMode: this.remoteConfig.getBoolean('maintenanceMode'),
      };

      this.logger.info('Feature flags cargados:', flags);
      this.featureFlags$.next(flags);
    } catch (error) {
      this.logger.error('Error cargando Remote Config', error);
      this.featureFlags$.next(this.defaultConfig);
    }
  }

  /**
   * Obtiene un feature flag específico
   * @param flagName Nombre del flag
   * @returns Valor del flag (booleano o número)
   */
  getFeatureFlag(flagName: string): boolean | number {
    const currentFlags = this.featureFlags$.value;
    return currentFlags[flagName] !== undefined ? currentFlags[flagName] : this.defaultConfig[flagName as keyof typeof this.defaultConfig];
  }

  /**
   * Obtiene todos los feature flags como Observable
   * @returns Observable con los flags actuales
   */
  getFeatureFlags(): Observable<any> {
    return this.featureFlags$.asObservable();
  }

  /**
   * Refresca la configuración remota manualmente
   */
  async refreshRemoteConfig(): Promise<void> {
    try {
      this.logger.info('Refrescando Remote Config');
      await this.loadRemoteConfig();
      this.logger.info('Remote Config refrescado correctamente');
    } catch (error) {
      this.logger.error('Error refrescando Remote Config', error);
    }
  }

  /**
   * Verifica si el servicio está inicializado
   * @returns true si está inicializado
   */
  isServiceInitialized(): boolean {
    return this.initialized;
  }
}
