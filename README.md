# 📱 Prueba Entrevista - Aplicación de Gestor de Tareas

> Una aplicación moderna de gestor de tareas con Ionic 7, Angular 17 y Firebase Remote Config

## 🎯 Características Principales

### ✅ Gestión de Tareas
- ✨ Crear, editar, eliminar y marcar tareas como completadas
- 🏷️ Asignar categorías a las tareas
- 🔍 Buscar tareas por título
- 📊 Filtrar por estado (todas, pendientes, completadas)
- 🎨 Filtrar por categoría
- 📈 Estadísticas en tiempo real (total, completadas, pendientes)

### 📂 Gestión de Categorías
- ✏️ Crear, editar y eliminar categorías
- 🎨 Seleccionar color personalizado para cada categoría
- 📝 Agregar descripción a las categorías
- 🚀 Integración con sistema de tareas

### 🔥 Firebase & Remote Config
- ⚙️ Integración completa con Firebase
- 🚩 Feature flags con Remote Config
- 🔄 Actualización dinámica de configuración sin redeploy
- 💾 Valores por defecto automáticos
- 🔐 Fallback seguro si Firebase no está disponible

### 🎨 Interfaz de Usuario
- 📱 Responsive design optimizado para móviles
- 🌟 Tema claro y moderno
- ⚡ Animaciones fluidas
- 📊 Indicadores visuales de estado
- 🔔 Sistema de notificaciones integrado

### 🛠️ Características Técnicas
- 🏗️ Arquitectura modular y escalable
- 📦 Componentes standalone de Angular
- 🧪 Pruebas unitarias con Jasmine/Karma
- 🌐 Interceptor HTTP personalizado
- 📝 Sistema de logging estructurado
- ✔️ Validación reactiva de formularios
- 💾 Persistencia local con Ionic Storage

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 16+ y npm
- Ionic CLI: `npm install -g @ionic/cli`
- Cuenta de Firebase (opcional, para features avanzados)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/FreddyBotiaCalle/pruebaEntrevista.git
cd pruebaEntrevista

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ionic serve
```

La aplicación estará disponible en `http://localhost:8100`

## 🔥 Configuración de Firebase (Opcional)

Para habilitar las características de Firebase y Remote Config:

1. **Crear Proyecto Firebase**
   - Ve a https://console.firebase.google.com
   - Crea un nuevo proyecto

2. **Obtener Credenciales**
   - Registra tu aplicación web
   - Copia las credenciales

3. **Actualizar la Aplicación**
   - Abre `src/app/services/firebase.service.ts`
   - Reemplaza los valores en `firebaseConfig`

4. **Configurar Remote Config**
   - En Firebase Console → Build → Remote Config
   - Crea los parámetros:
     - `categoriesEnabled` (boolean)
     - `maxTodosPerUser` (number)
     - `enableNotifications` (boolean)
     - `maintenanceMode` (boolean)

Para más detalles, consulta [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) | Guía completa de configuración Firebase |
| [FIREBASE_INTEGRATION_SUMMARY.md](./FIREBASE_INTEGRATION_SUMMARY.md) | Resumen de cambios y cómo usar |
| [FEATURE_FLAGS_EXAMPLES.md](./FEATURE_FLAGS_EXAMPLES.md) | 12 ejemplos prácticos de feature flags |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Guía de desarrollo y estructura del proyecto |

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   │   ├── todo-form/
│   │   ├── todo-list/
│   │   ├── todo-filters/
│   │   ├── todo-edit-modal/
│   │   ├── category-list/
│   │   ├── category-modal/
│   │   └── feature-flags/
│   ├── pages/               # Páginas de la aplicación
│   │   └── home/
│   ├── services/            # Servicios
│   │   ├── todo.service.ts
│   │   ├── category.service.ts
│   │   ├── firebase.service.ts
│   │   ├── notification.service.ts
│   │   ├── logger.service.ts
│   │   └── validation.service.ts
│   ├── models/              # Interfaces y tipos
│   │   ├── todo.model.ts
│   │   └── category.model.ts
│   ├── core/                # Módulos, guardias, interceptores
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── helpers/
│   ├── app.routes.ts        # Configuración de rutas
│   └── app.component.ts     # Componente raíz
├── assets/                  # Recursos estáticos
├── theme/                   # Temas de SCSS
└── main.ts                  # Bootstrap de la aplicación
```

## 🎮 Cómo Usar

### Crear una Tarea
1. Completa el formulario en "Crear Tarea"
2. (Opcional) Selecciona una categoría
3. Haz clic en "Crear Tarea"

### Editar una Tarea
1. Haz clic en el ícono de lápiz en la tarea
2. Modifica los campos
3. Guarda los cambios

### Eliminar una Tarea
1. Haz clic en el ícono de papelera
2. Confirma la eliminación

### Filtrar Tareas
1. Usa la barra de búsqueda para filtrar por título
2. Selecciona estado: Todas, Pendientes o Completadas
3. Selecciona una categoría para filtrar

### Gestionar Categorías
1. Haz clic en "Nueva Categoría"
2. Selecciona un color y agrega nombre/descripción
3. Usa las categorías en tus tareas

### Monitorear Feature Flags
1. Mira la sección "Feature Flags" en la página
2. Haz clic en "Refrescar desde Firebase" para actualizar
3. El estado se refleja inmediatamente en la interfaz

## 🔄 Feature Flags Disponibles

| Flag | Tipo | Descripción | Por Defecto |
|------|------|-------------|------------|
| `categoriesEnabled` | boolean | Habilita/deshabilita categorías | true |
| `maxTodosPerUser` | number | Límite de tareas por usuario | 100 |
| `enableNotifications` | boolean | Activa/desactiva notificaciones | true |
| `maintenanceMode` | boolean | Modo de mantenimiento | false |

## 🧪 Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Pruebas con coverage
ng test --code-coverage

# Pruebas en CI mode (una sola ejecución)
ng test --watch=false
```

## 📦 Build para Producción

```bash
# Build optimizado
npm run build

# Salida en carpeta 'www/'
```

## 🔐 Seguridad

- ✅ Validación de entrada en formularios
- ✅ Interceptor HTTP para manejo de errores
- ✅ LocalStorage encriptado con Ionic Storage
- ⚠️ NO commits credenciales de Firebase (usar variables de entorno)
- ✅ Fallback seguro a valores por defecto

## 🐛 Troubleshooting

### La aplicación muestra pantalla en blanco
- Limpia el caché: `ionic serve --cleanup`
- Verifica la consola del navegador para errores

### Los feature flags no se actualizan
- Verifica que Firebase esté correctamente configurado
- Revisa que los parámetros en Remote Config coincidan exactamente
- Haz clic en "Refrescar desde Firebase"

### Las tareas no se guardan
- Verifica que Ionic Storage esté inicializado
- Revisa el almacenamiento local en DevTools (Application tab)

Para más ayuda, consulta [FIREBASE_SETUP.md](./FIREBASE_SETUP.md#troubleshooting)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT - ver archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Freddy Botía Calle**
- GitHub: [@FreddyBotiaCalle](https://github.com/FreddyBotiaCalle)
- Repositorio: [pruebaEntrevista](https://github.com/FreddyBotiaCalle/pruebaEntrevista)

## 📞 Soporte

- 📖 [Documentación Ionic](https://ionicframework.com/docs)
- 📖 [Documentación Angular](https://angular.io/docs)
- 🔥 [Documentación Firebase](https://firebase.google.com/docs)
- 🔥 [Angular Fire](https://github.com/angular/angularfire)

## ✨ Cambios Recientes

### v2.0.0 - Firebase & Remote Config (Último)
- 🔥 Integración completa de Firebase
- 🚩 Sistema de feature flags con Remote Config
- 📱 Componente FeatureFlagsComponent para monitorear flags
- 📚 Documentación completa de configuración
- 🔄 Actualización dinámica sin redeploy
- 💾 Fallback automático a valores por defecto

### v1.0.0 - Release Inicial
- ✅ Gestión completa de tareas (CRUD)
- 📂 Gestión de categorías
- 🔍 Búsqueda y filtrado
- 🧪 Pruebas unitarias
- 📝 Logging estructurado
- 🎨 Tema claro y responsivo

## 🎯 Próximos Pasos

- [ ] Autenticación de usuarios con Firebase Auth
- [ ] Sincronización en tiempo real con Firestore
- [ ] A/B Testing con feature flags
- [ ] Analytics avanzados
- [ ] Aplicación nativa con Capacitor
- [ ] PWA completo para offline-first

---

**Hecho con ❤️ usando Ionic, Angular y Firebase**
