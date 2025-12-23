# Configuración de Firebase y Remote Config

## 🔥 Descripción General

La aplicación está lista para usar Firebase y Remote Config con feature flags. Este documento explica cómo configurar tu proyecto de Firebase personal.

## 📋 Requisitos Previos

1. Cuenta de Google
2. Acceso a [Firebase Console](https://console.firebase.google.com)
3. Node.js y npm instalados

## 🚀 Pasos de Configuración

### 1. Crear un Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Haz clic en "Agregar proyecto"
3. Completa los detalles:
   - Nombre del proyecto: `pruebaEntrevista` (o el que prefieras)
   - Habilita Google Analytics (opcional)
4. Haz clic en "Crear proyecto"

### 2. Registrar tu Aplicación Web

1. En la página de descripción general, haz clic en el ícono web `</>`
2. Registra tu aplicación con el apodo: `Prueba Entrevista`
3. Copia la configuración de Firebase que se muestra (necesitarás estos valores)

### 3. Obtener tus Credenciales de Firebase

De la configuración, necesitarás estos valores:
```
{
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_PROJECT.firebaseapp.com",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_PROJECT.appspot.com",
  "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
  "appId": "YOUR_APP_ID",
  "measurementId": "YOUR_MEASUREMENT_ID"
}
```

### 4. Actualizar la Configuración en la Aplicación

Abre `src/app/services/firebase.service.ts` y reemplaza los valores en el objeto `firebaseConfig`:

```typescript
private firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID',
};
```

### 5. Habilitar Remote Config en Firebase

1. En la consola de Firebase, ve a **Build** → **Remote Config**
2. Haz clic en "Crear configuración"
3. Agrega los siguientes parámetros:

#### Parámetro 1: `categoriesEnabled`
- **Tipo:** Boolean
- **Valor predeterminado:** `true`
- **Descripción:** Controla si la funcionalidad de categorías está habilitada

#### Parámetro 2: `maxTodosPerUser`
- **Tipo:** Number
- **Valor predeterminado:** `100`
- **Descripción:** Número máximo de tareas que puede crear un usuario

#### Parámetro 3: `enableNotifications`
- **Tipo:** Boolean
- **Valor predeterminado:** `true`
- **Descripción:** Controla si las notificaciones están habilitadas

#### Parámetro 4: `maintenanceMode`
- **Tipo:** Boolean
- **Valor predeterminado:** `false`
- **Descripción:** Si es true, muestra un mensaje de mantenimiento

4. Haz clic en **Publicar** para guardar la configuración

### 6. Probar la Configuración

1. Inicia el servidor de desarrollo:
   ```bash
   ionic serve
   ```

2. Abre la aplicación en http://localhost:4200

3. Verifica que aparezca la sección de "Feature Flags" en la página de inicio

4. El botón "Refresh" debería actualizar los valores desde Firebase

## 🔄 Cambiar Feature Flags en Tiempo Real

1. Ve a **Remote Config** en la consola de Firebase
2. Modifica el valor de `categoriesEnabled` a `false`
3. Publica los cambios
4. En la aplicación, haz clic en el botón "Refresh" en la sección Feature Flags
5. Verifica que la sección de categorías desaparezca

## 🏗️ Arquitectura de Feature Flags

### Servicio Firebase

El archivo `src/app/services/firebase.service.ts` contiene:
- Inicialización de Firebase
- Carga de Remote Config
- Métodos para acceder a los feature flags
- Lógica de refresh

### Componente Feature Flags

El archivo `src/app/components/feature-flags/feature-flags.component.ts` muestra:
- Estado actual de todos los flags
- Indicadores visuales (verde/rojo/amarillo)
- Botón para refrescar manualmente

### Integración en HomePage

El archivo `src/app/pages/home/home.page.ts`:
- Monitorea el flag `categoriesEnabled`
- Muestra u oculta la sección de categorías dinámicamente
- Muestra un mensaje informativo cuando está deshabilitado

## 📊 Estructura de Datos

```
Remote Config
├── categoriesEnabled (boolean) - Habilita/deshabilita categorías
├── maxTodosPerUser (number) - Límite de tareas por usuario
├── enableNotifications (boolean) - Activa/desactiva notificaciones
└── maintenanceMode (boolean) - Modo de mantenimiento
```

## 🔐 Seguridad

**IMPORTANTE:** No commits credenciales de Firebase en el repositorio. La configuración debe ser:
- Específica de tu cuenta Firebase
- Regenerada si se expone accidentalmente
- Mantenida en un archivo `.env` si usas CI/CD

## 🐛 Troubleshooting

### El Remote Config no se carga
- Verifica que la configuración de Firebase sea correcta
- Revisa la consola del navegador para ver errores
- Asegúrate de que los parámetros están publicados en Firebase Console

### Los feature flags siempre muestran valores por defecto
- Verifica que la aplicación tenga acceso a Internet
- Revisa que los parámetros de Remote Config estén correctamente nombrados
- Abre la pestaña Red en las DevTools para ver las solicitudes a Firebase

### El botón Refresh no funciona
- Asegúrate de que `firebaseService.refreshRemoteConfig()` esté llamado
- Verifica que la aplicación tenga permisos de lectura en Remote Config

## 📚 Recursos Adicionales

- [Documentación Firebase](https://firebase.google.com/docs)
- [Angular Fire Documentation](https://github.com/angular/angularfire)
- [Remote Config Guide](https://firebase.google.com/docs/remote-config)

## ✅ Checklist de Configuración

- [ ] Crear proyecto en Firebase Console
- [ ] Registrar aplicación web
- [ ] Copiar credenciales de Firebase
- [ ] Actualizar `firebase.service.ts` con credenciales
- [ ] Habilitar Remote Config en Firebase
- [ ] Crear parámetros de feature flags
- [ ] Publicar configuración de Remote Config
- [ ] Iniciar servidor de desarrollo
- [ ] Verificar que feature flags aparezcan en la UI
- [ ] Probar cambiar `categoriesEnabled` a false
- [ ] Verificar que la sección de categorías desaparezca
