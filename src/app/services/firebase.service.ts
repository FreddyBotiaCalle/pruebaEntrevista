import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
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
      this.remoteConfig.settings.minimumFetchIntervalMillis = 30000; // 30 segundos (para desarrollo)
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
        this.logger.warn('Remote Config no está disponible, usando valores por defecto');
        this.featureFlags$.next(this.defaultConfig);
        return;
      }

      this.logger.info('🔄 Iniciando carga de Remote Config desde Firebase...');
      
      // Hacer fetch de Firebase
      const status = await fetchAndActivate(this.remoteConfig);
      this.logger.info(`✅ fetchAndActivate completado. Status: ${status}`);

      // Obtener los valores usando la API correcta de Firebase
      // Los valores en Remote Config pueden ser strings, así que intentamos parsearlos
      // Usar la API modular de Firebase Remote Config v9+
      // getValue(remoteConfig, key).asString()
      // Importa getValue arriba si no está
      const getCategoryEnabled = (): boolean => {
        try {
          const val = getValue(this.remoteConfig, 'categoriesEnabled').asString();
          this.logger.debug(`categoriesEnabled (raw): ${val}`);
          return val === 'true' || val === '1';
        } catch (e) {
          this.logger.warn(`Error obteniendo categoriesEnabled: ${e}`);
          return this.defaultConfig.categoriesEnabled;
        }
      };

      const getMaxTodos = (): number => {
        try {
          const val = getValue(this.remoteConfig, 'maxTodosPerUser').asString();
          this.logger.debug(`maxTodosPerUser (raw): ${val}`);
          return parseInt(val, 10) || this.defaultConfig.maxTodosPerUser;
        } catch (e) {
          this.logger.warn(`Error obteniendo maxTodosPerUser: ${e}`);
          return this.defaultConfig.maxTodosPerUser;
        }
      };

      const getEnableNotifications = (): boolean => {
        try {
          const val = getValue(this.remoteConfig, 'enableNotifications').asString();
          this.logger.debug(`enableNotifications (raw): ${val}`);
          return val === 'true' || val === '1';
        } catch (e) {
          this.logger.warn(`Error obteniendo enableNotifications: ${e}`);
          return this.defaultConfig.enableNotifications;
        }
      };

      const getMaintenanceMode = (): boolean => {
        try {
          const val = getValue(this.remoteConfig, 'maintenanceMode').asString();
          this.logger.debug(`maintenanceMode (raw): ${val}`);
          return val === 'true' || val === '1';
        } catch (e) {
          this.logger.warn(`Error obteniendo maintenanceMode: ${e}`);
          return this.defaultConfig.maintenanceMode;
        }
      };

      const flags = {
        categoriesEnabled: getCategoryEnabled(),
        maxTodosPerUser: getMaxTodos(),
        enableNotifications: getEnableNotifications(),
        maintenanceMode: getMaintenanceMode(),
      };

      this.logger.info('✅ Feature flags cargados desde Firebase:', flags);
      this.featureFlags$.next(flags);
    } catch (error) {
      this.logger.error('❌ Error cargando Remote Config:', error);
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
