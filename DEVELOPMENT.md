# Documentación de Desarrollo

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
src/app/
├── core/                          # Lógica central de la aplicación
│   ├── constants/                 # Constantes globales
│   ├── directives/                # Directivas personalizadas
│   ├── guards/                    # Route guards
│   ├── handlers/                  # Error handlers
│   ├── interceptors/              # HTTP interceptors
│   ├── pipes/                     # Pipes personalizados
│   └── utils/                     # Utilidades/helpers
├── pages/                         # Páginas de la aplicación
│   ├── home/
│   └── not-found/
├── components/                    # Componentes reutilizables
│   ├── todo-form/
│   ├── todo-list/
│   ├── todo-filters/
│   └── todo-edit-modal/
├── models/                        # Modelos de datos
│   ├── todo.model.ts
│   └── api.model.ts
├── services/                      # Servicios (lógica de negocio)
│   ├── todo.service.ts
│   ├── notification.service.ts
│   ├── config.service.ts
│   ├── logger.service.ts
│   └── validation.service.ts
├── app.component.ts
├── app.module.ts
├── app-routing.module.ts
└── app.routes.ts
```

## 📝 Convenciones de Código

### Nombrado de Archivos
- Componentes: `*.component.ts`
- Servicios: `*.service.ts`
- Pipes: `*.pipe.ts`
- Directivas: `*.directive.ts`
- Modelos: `*.model.ts`
- Guards: `*.guard.ts`

### Estructura de Componentes

```typescript
// 1. Imports
import { Component, Input, Output, EventEmitter } from '@angular/core';

// 2. Decorador
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, ...],
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
})

// 3. Clase
export class ExampleComponent {
  // Propiedades
  // Input/Output
  // Métodos
}
```

### Estructura de Servicios

```typescript
// 1. Imports
import { Injectable } from '@angular/core';

// 2. Decorador
@Injectable({
  providedIn: 'root',
})

// 3. Clase
export class ExampleService {
  // Propiedades privadas
  // Constructor
  // Métodos públicos
  // Métodos privados
}
```

## 🧪 Testing

### Ejecutar Tests
```bash
npm test
```

### Estructura de Tests
```typescript
describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoService],
    });
    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

## 🎨 Estilos

### Variables CSS de Ionic
```scss
// Colores
--ion-color-primary: #3880ff;
--ion-color-success: #2dd36f;
--ion-color-danger: #eb445a;
--ion-color-warning: #ffc409;

// Espaciado
--ion-padding: 16px;
--ion-margin: 16px;

// Border radius
--ion-border-radius: 4px;
```

## 📦 Dependencias Principales

- **@angular/core**: Framework principal
- **@ionic/angular**: Componentes UI
- **@ionic/storage-angular**: Almacenamiento local
- **rxjs**: Programación reactiva
- **typescript**: Type-safe development

## 🔧 Configuración

### Environment
Los archivos de ambiente están en `src/environments/`:
- `environment.ts` - Desarrollo
- `environment.prod.ts` - Producción

### Constants
Las constantes globales están en `src/app/core/constants/app.constants.ts`

## 🚀 Deploy

### Build para Producción
```bash
npm run build
```

### Build para Mobile
```bash
# Android
ionic cap add android
ionic cap build android

# iOS
ionic cap add ios
ionic cap build ios
```

## 📚 Recursos Útiles

- [Documentación Ionic](https://ionicframework.com/docs)
- [Documentación Angular](https://angular.io/docs)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🐛 Debugging

### Console Logs
Usar `LoggerService` para logs organizados:

```typescript
constructor(private logger: LoggerService) {}

ngOnInit() {
  this.logger.info('Componente inicializado');
  this.logger.debug('Datos:', data);
  this.logger.error('Hubo un error', error);
}
```

### DevTools
F12 en el navegador para ver:
- Console (logs)
- Network (requests)
- Application (storage)

## ✅ Checklist para Nueva Funcionalidad

- [ ] Crear modelo/interfaz en `models/`
- [ ] Crear servicio en `services/`
- [ ] Crear componente en `components/`
- [ ] Actualizar rutas si es necesario
- [ ] Crear tests unitarios
- [ ] Documentar en comentarios JSDoc
- [ ] Validar sin errores de compilación
- [ ] Hacer commit con descripción clara

---

**Última actualización**: Diciembre 2025
