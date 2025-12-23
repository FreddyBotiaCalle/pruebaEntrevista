import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonBadge,
  IonSpinner,
} from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FirebaseService } from '../../services/firebase.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-feature-flags',
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonBadge,
    IonSpinner,
  ],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>🚩 Feature Flags</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <!-- categoriesEnabled Flag -->
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p style="margin: 0; font-weight: bold;">Categorías Habilitadas</p>
              <small style="color: #666;">Activa o desactiva la funcionalidad de categorías</small>
            </div>
            <ion-badge
              [color]="flags.categoriesEnabled ? 'success' : 'danger'"
              style="padding: 0.5rem 1rem; font-size: 0.9rem;"
            >
              {{ flags.categoriesEnabled ? '✓ Activo' : '✗ Inactivo' }}
            </ion-badge>
          </div>

          <!-- enableNotifications Flag -->
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p style="margin: 0; font-weight: bold;">Notificaciones Habilitadas</p>
              <small style="color: #666;">Controla si se muestran notificaciones</small>
            </div>
            <ion-badge
              [color]="flags.enableNotifications ? 'success' : 'danger'"
              style="padding: 0.5rem 1rem; font-size: 0.9rem;"
            >
              {{ flags.enableNotifications ? '✓ Activo' : '✗ Inactivo' }}
            </ion-badge>
          </div>

          <!-- maintenanceMode Flag -->
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p style="margin: 0; font-weight: bold;">Modo de Mantenimiento</p>
              <small style="color: #666;">Indica si hay mantenimiento programado</small>
            </div>
            <ion-badge
              [color]="flags.maintenanceMode ? 'warning' : 'medium'"
              style="padding: 0.5rem 1rem; font-size: 0.9rem;"
            >
              {{ flags.maintenanceMode ? '⚠ Activo' : '○ Inactivo' }}
            </ion-badge>
          </div>

          <!-- maxTodosPerUser Value -->
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p style="margin: 0; font-weight: bold;">Máximo de Tareas por Usuario</p>
              <small style="color: #666;">Límite de tareas que puede crear</small>
            </div>
            <ion-badge color="primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
              📊 {{ flags.maxTodosPerUser }}
            </ion-badge>
          </div>

          <!-- Refresh Button -->
          <div style="margin-top: 1rem; text-align: center;">
            <ion-button
              expand="block"
              fill="outline"
              (click)="refreshFlags()"
              [disabled]="isRefreshing"
            >
              <span *ngIf="!isRefreshing">🔄 Refrescar desde Firebase</span>
              <span *ngIf="isRefreshing">
                <ion-spinner name="dots" style="margin-right: 0.5rem;"></ion-spinner>
                Actualizando...
              </span>
            </ion-button>
            <p *ngIf="lastRefreshed" style="margin: 0.5rem 0 0 0; font-size: 0.8rem; color: #666;">
              Última actualización: {{ lastRefreshed | date: 'HH:mm:ss' }}
            </p>
          </div>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  styles: [
    `
      :host {
        --ion-card-background: #f8f9fa;
      }
    `,
  ],
})
export class FeatureFlagsComponent implements OnInit, OnDestroy {
  flags = {
    categoriesEnabled: true,
    enableNotifications: true,
    maintenanceMode: false,
    maxTodosPerUser: 100,
  };
  isRefreshing = false;
  lastRefreshed: Date | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private firebaseService: FirebaseService,
    private logger: LoggerService
  ) {}

  ngOnInit() {
    // Cargar los flags iniciales
    this.firebaseService
      .getFeatureFlags()
      .pipe(takeUntil(this.destroy$))
      .subscribe((flags) => {
        this.flags = flags;
        this.lastRefreshed = new Date();
        this.logger.info('Feature flags actualizados:', flags);
      });
  }

  async refreshFlags() {
    this.isRefreshing = true;
    try {
      await this.firebaseService.refreshRemoteConfig();
    } catch (error) {
      this.logger.error('Error refrescando feature flags', error);
    } finally {
      this.isRefreshing = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
