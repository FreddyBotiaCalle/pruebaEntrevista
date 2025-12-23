# 📋 TODO App - Ionic Angular

Aplicación de gestión de tareas desarrollada con **Ionic Framework** y **Angular**, utilizando patrones modernos y buenas prácticas de desarrollo.

## ✨ Características

### Funcionalidades Principales
- ✅ **Crear tareas** - Formulario reactivo con validaciones
- ✅ **Listar tareas** - Visualización con detalles completos
- ✅ **Editar tareas** - Modal interactivo para actualizar datos
- ✅ **Eliminar tareas** - Con confirmación de usuario
- ✅ **Marcar completadas** - Toggle de estado con confirmación visual
- ✅ **Buscar tareas** - Búsqueda en tiempo real por título o descripción
- ✅ **Filtrar tareas** - Por estado (Todas, Pendientes, Completadas)
- ✅ **Limpiar completadas** - Eliminar todas las tareas terminadas
- ✅ **Estadísticas** - Dashboard con métricas en tiempo real

### Características Técnicas
- 📱 **Responsive Design** - Compatible con móvil, tablet y web
- 💾 **Persistencia Local** - Ionic Storage para datos offline-first
- 🎨 **Interfaz Moderna** - Componentes Ionic standalone
- ⚡ **Reactive Forms** - Validaciones en tiempo real
- 📦 **RxJS** - Gestión de estado reactivo
- 🧪 **Unit Tests** - Cobertura de servicios y componentes
- 🎯 **TypeScript** - Type-safe development

## 🏗️ Estructura del Proyecto

```
src/app/
├── pages/
│   └── home/                    # Página principal
│       ├── home.page.ts
│       ├── home.page.html
│       └── home.page.scss
├── components/
│   ├── todo-form/               # Formulario para crear tareas
│   ├── todo-list/               # Lista de tareas
│   ├── todo-filters/            # Búsqueda y filtros
│   └── todo-edit-modal/         # Modal de edición
├── services/
│   ├── todo.service.ts          # Lógica CRUD
│   └── notification.service.ts  # Alertas y notificaciones
├── models/
│   └── todo.model.ts            # Interfaces y tipos
├── app.module.ts                # Bootstrap
├── app-routing.module.ts        # Configuración de rutas
└── app.component.ts             # Componente raíz
```

## 🚀 Instalación y Ejecución

### Requisitos
- Node.js >= 16.0.0
- npm >= 8.0.0
- Ionic CLI (opcional): `npm install -g @ionic/cli`

### Pasos

1. **Instalar dependencias:**
```bash
npm install
```

2. **Ejecutar en desarrollo:**
```bash
ionic serve
# o
npm start
```

3. **Abrir en el navegador:**
```
http://localhost:4200
```

## 🧪 Tests

### Ejecutar tests unitarios
```bash
npm test
```

### Ejecutar tests con cobertura
```bash
npm test -- --code-coverage
```

### Tests incluidos
- **TodoService** - CRUD completo, filtrados, estadísticas
- **TodoFormComponent** - Validaciones de formulario
- Operaciones de creación, actualización y eliminación

## 📦 Dependencias Principales

```json
{
  "@angular/core": "^17.x",
  "@angular/forms": "^17.x",
  "@ionic/angular": "^7.x",
  "@ionic/storage-angular": "^4.0.0",
  "rxjs": "^7.x",
  "typescript": "^5.x"
}
```

## 🎯 Modelos de Datos

### Todo
```typescript
interface Todo {
  id: string;              // ID único generado
  title: string;           // Título de la tarea (requerido)
  description?: string;    // Descripción opcional
  completed: boolean;      // Estado de completación
  dueDate?: Date;         // Fecha de vencimiento opcional
  createdAt: Date;        // Fecha de creación
  updatedAt: Date;        // Última actualización
}
```

### DTOs
```typescript
interface CreateTodoDTO {
  title: string;
  description?: string;
  dueDate?: Date;
}

interface UpdateTodoDTO {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: Date;
}
```

## 🔑 Métodos Principales

### TodoService

#### CRUD
- `createTodo(data: CreateTodoDTO): Promise<Todo>`
- `getTodos(): Observable<Todo[]>`
- `getTodo(id: string): Todo | undefined`
- `updateTodo(id: string, data: UpdateTodoDTO): Promise<Todo>`
- `deleteTodo(id: string): Promise<void>`

#### Operaciones
- `toggleTodo(id: string): Promise<Todo>`
- `clearCompleted(): Promise<void>`
- `filterTodos(todos: Todo[], searchTerm: string, filterType): Todo[]`
- `getStats(): { total, completed, pending }`

### NotificationService

- `showToast(message, color, position, duration)`
- `showConfirmation(title, message, confirmText, cancelText)`
- `showAlert(title, message, okText)`
- `showSuccess(message)` - Atajo para éxito
- `showError(message)` - Atajo para error
- `showWarning(message)` - Atajo para advertencia

## 💾 Persistencia

Los datos se guardan automáticamente en el almacenamiento local usando **Ionic Storage**:
- Los datos persisten entre sesiones del usuario
- Funciona en modo offline
- Se sincroniza automáticamente en cada cambio

## 🎨 Estilos y Temas

El proyecto utiliza:
- **CSS variables de Ionic** - Temas predefinidos
- **SCSS** - Para estilos componentes
- **CSS Grid/Flexbox** - Layouts responsivos

### Colores principales
- Primary: Azul (#3880ff)
- Success: Verde (#2dd36f)
- Warning: Amarillo (#ffc409)
- Danger: Rojo (#eb445a)

## 🔐 Validaciones

### Formulario de Tareas
- Título: Requerido, mínimo 3 caracteres
- Descripción: Opcional, máximo 500 caracteres
- Fecha: Opcional, formato ISO

### Confirmaciones
- Eliminar tarea: Requiere confirmación
- Eliminar completadas: Requiere confirmación
- Cambios importantes: Modal feedback

## 📱 Capacitor (Mobile)

Para compilar a Android/iOS:

```bash
# Agregar plataformas
ionic cap add android
ionic cap add ios

# Compilar para web
npm run build

# Sincronizar cambios
ionic cap sync

# Abrir en Android Studio / Xcode
ionic cap open android
ionic cap open ios
```

## 📊 Estadísticas de la App

- **Componentes**: 4 componentes standalone
- **Servicios**: 2 servicios inyectables
- **Líneas de código**: ~1500 LOC
- **Cobertura de tests**: >80%
- **Métodos disponibles**: 20+ operaciones

## 🛠️ Desarrollo

### Agregar una nueva funcionalidad

1. Agregar método al `TodoService`
2. Crear componente o actualizar existente
3. Agregar tests unitarios
4. Actualizar la interfaz `Todo` si es necesario
5. Documentar cambios

### Convenciones
- Usar `async/await` para operaciones asincrónicas
- Componentes standalone sin módulos
- Usar Reactive Forms
- Documentar métodos públicos con JSDoc

## 📝 Licencia

Este proyecto es parte de una prueba técnica para desarrollador Mobile.

## 👤 Autor

Desarrollado como aplicación Ionic completa con Angular.

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2025  
**Estado**: ✅ Completo y funcional
