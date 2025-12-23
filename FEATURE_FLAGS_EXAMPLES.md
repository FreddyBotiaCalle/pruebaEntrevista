# Ejemplos de Uso de Feature Flags en Componentes

Este documento proporciona ejemplos prácticos de cómo usar Firebase Remote Config y feature flags en diferentes componentes de tu aplicación.

## 1. Monitorear Feature Flags en un Componente

### Ejemplo: Componente que cambia comportamiento basado en flags

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-my-component',
  template: `
    <div *ngIf="categoriesEnabled">
      <!-- Contenido si categorías están habilitadas -->
      <p>Las categorías están disponibles</p>
    </div>
    <div *ngIf="!categoriesEnabled">
      <!-- Contenido si categorías están deshabilitadas -->
      <p>Las categorías no están disponibles en este momento</p>
    </div>
  `
})
export class MyComponent implements OnInit, OnDestroy {
  categoriesEnabled = true;
  private destroy$ = new Subject<void>();

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    // Monitorear cambios en el flag
    this.firebaseService
      .getFeatureFlags()
      .pipe(takeUntil(this.destroy$))
      .subscribe((flags) => {
        this.categoriesEnabled = flags.categoriesEnabled;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## 2. Usar un Flag Individual

```typescript
// En un componente o servicio
export class TodoFormComponent {
  constructor(private firebaseService: FirebaseService) {}

  submitForm() {
    const maxTodos = this.firebaseService.getFeatureFlag('maxTodosPerUser');
    
    if (this.totalTodos >= maxTodos) {
      console.warn(`Has alcanzado el límite de ${maxTodos} tareas`);
      return;
    }
    
    // Continuar con la creación de la tarea
  }
}
```

## 3. Condicionar la Visualización de UI

### Mostrar/Ocultar Secciones

```html
<!-- Template HTML -->
<div *ngIf="categoriesEnabled">
  <h2>Gestión de Categorías</h2>
  <app-category-list></app-category-list>
  <app-category-modal></app-category-modal>
</div>

<div *ngIf="!categoriesEnabled" class="warning-banner">
  <ion-icon name="information-circle"></ion-icon>
  <p>La funcionalidad de categorías está deshabilitada</p>
</div>
```

### Condicionar Botones

```html
<ion-button 
  *ngIf="enableNotifications"
  (click)="sendNotification()"
  color="primary"
>
  🔔 Enviar Notificación
</ion-button>
```

## 4. Validar Límites desde Remote Config

```typescript
// En tu servicio TodoService
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  constructor(private firebaseService: FirebaseService) {}

  createTodo(todo: Todo): Promise<void> {
    // Obtener el límite máximo desde Remote Config
    const maxTodos = this.firebaseService.getFeatureFlag('maxTodosPerUser');
    
    // Validar límite
    if (this.todos.length >= maxTodos) {
      throw new Error(`Has alcanzado el límite de ${maxTodos} tareas`);
    }

    // Crear la tarea
    return this.saveTodo(todo);
  }
}
```

## 5. Mostrar Modo de Mantenimiento

```typescript
// En HomePage o AppComponent
export class HomePage implements OnInit {
  maintenanceMode = false;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.firebaseService
      .getFeatureFlags()
      .subscribe((flags) => {
        this.maintenanceMode = flags.maintenanceMode;
      });
  }
}
```

```html
<!-- Template -->
<div *ngIf="maintenanceMode" class="maintenance-banner">
  <ion-alert
    message="⚠️ Sistema en Mantenimiento"
    subHeader="La aplicación se está actualizando"
    [buttons]="['OK']"
  ></ion-alert>
</div>
```

## 6. Control de Funcionalidades Experimentales

```typescript
// Crear un flag para features en prueba
// En Firebase Remote Config: "experimentalCategories" = false

@Component({
  selector: 'app-category-experimental',
  template: `
    <div *ngIf="experimentalMode; else standardCategories">
      <!-- Nueva interfaz experimental -->
      <app-category-list-experimental></app-category-list-experimental>
    </div>
    
    <ng-template #standardCategories>
      <!-- Interfaz estándar -->
      <app-category-list></app-category-list>
    </ng-template>
  `
})
export class CategoryExperimentalComponent {
  experimentalMode = false;

  constructor(private firebaseService: FirebaseService) {
    this.experimentalMode = this.firebaseService.getFeatureFlag('experimentalCategories') as boolean;
  }
}
```

## 7. Notificaciones Condicionales

```typescript
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class TodoNotificationService {
  constructor(
    private notificationService: NotificationService,
    private firebaseService: FirebaseService
  ) {}

  notifyTodoCreated(todo: Todo) {
    // Solo enviar notificación si está habilitada
    if (this.firebaseService.getFeatureFlag('enableNotifications')) {
      this.notificationService.showSuccess(`Tarea creada: ${todo.title}`);
    }
  }

  notifyTodoCompleted(todo: Todo) {
    if (this.firebaseService.getFeatureFlag('enableNotifications')) {
      this.notificationService.showSuccess(`¡Tarea completada! 🎉`);
    }
  }
}
```

## 8. Guardia de Ruta Basada en Feature Flags

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesEnabledGuard implements CanActivate {
  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const categoriesEnabled = this.firebaseService.getFeatureFlag('categoriesEnabled');

    if (!categoriesEnabled) {
      // Redirigir a página de inicio o página de no disponible
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}

// Uso en rutas:
// const routes: Routes = [
//   {
//     path: 'categories-management',
//     component: CategoriesManagementComponent,
//     canActivate: [CategoriesEnabledGuard]
//   }
// ];
```

## 9. Pipe Personalizado para Feature Flags

```typescript
import { Pipe, PipeTransform } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Pipe({
  name: 'featureFlag',
  standalone: true
})
export class FeatureFlagPipe implements PipeTransform {
  constructor(private firebaseService: FirebaseService) {}

  transform(flagName: string): boolean {
    return this.firebaseService.getFeatureFlag(flagName) as boolean;
  }
}

// Uso en template:
// <div *ngIf="'categoriesEnabled' | featureFlag">
//   <!-- Contenido -->
// </div>
```

## 10. Directiva Personalizada para Feature Flags

```typescript
import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Directive({
  selector: '[appFeatureFlag]',
  standalone: true
})
export class FeatureFlagDirective implements OnInit {
  @Input() appFeatureFlag!: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    const isEnabled = this.firebaseService.getFeatureFlag(this.appFeatureFlag);
    
    if (isEnabled) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}

// Uso en template:
// <div *appFeatureFlag="'categoriesEnabled'">
//   <!-- Contenido solo visible si categoriesEnabled es true -->
// </div>
```

## 11. Composición de Múltiples Flags

```typescript
// Mostrar contenido solo si múltiples condiciones se cumplen
export class DashboardComponent implements OnInit {
  showAdvancedFeatures = false;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.firebaseService.getFeatureFlags().subscribe((flags) => {
      // Mostrar features avanzadas solo si:
      // - Las categorías están habilitadas Y
      // - Las notificaciones están habilitadas Y
      // - No hay modo de mantenimiento
      this.showAdvancedFeatures =
        flags.categoriesEnabled &&
        flags.enableNotifications &&
        !flags.maintenanceMode;
    });
  }
}
```

## 12. Analytics con Feature Flags

```typescript
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(
    private firebaseService: FirebaseService,
    private logger: LoggerService
  ) {}

  trackFeatureUsage(featureName: string, action: string) {
    const isEnabled = this.firebaseService.getFeatureFlag(featureName);
    
    this.logger.info(`Feature: ${featureName} | Enabled: ${isEnabled} | Action: ${action}`);
    
    // En producción, enviar a Analytics
    // firebase.analytics().logEvent('feature_usage', {
    //   feature: featureName,
    //   enabled: isEnabled,
    //   action: action
    // });
  }
}
```

## Tabla de Referencia Rápida

| Tarea | Código |
|-------|--------|
| Obtener un flag | `firebaseService.getFeatureFlag('flagName')` |
| Monitorear cambios | `firebaseService.getFeatureFlags().subscribe()` |
| Refrescar flags | `firebaseService.refreshRemoteConfig()` |
| Verificar inicialización | `firebaseService.isServiceInitialized()` |

## Mejores Prácticas

✅ **DO:**
- Usa observables con `takeUntil(destroy$)` para evitar memory leaks
- Verifica `isServiceInitialized()` si necesitas el valor inmediatamente
- Usa nombres de flags descriptivos y en camelCase
- Documenta qué hace cada flag

❌ **DON'T:**
- No hagas llamadas síncronas a Remote Config en construcción
- No olvides unsubscribirse de observables
- No cambies nombres de flags sin migración
- No uses flags para lógica de seguridad crítica (valida en backend)

---

**Consulta FIREBASE_SETUP.md para la configuración inicial**
