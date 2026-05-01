# Arquitectura del Proyecto

El **Branch Name Formatter** está construido con un enfoque en la simplicidad, mantenibilidad y privacidad.

## 🏗️ Estructura Principal

### 1. Capa de Lógica (Core)
- **`Branch.ts`**: La entidad que representa el nombre de una rama. Maneja la lógica de formateo (unir partes con guiones, etc.).
- **`BranchManager.ts`**: Una clase Singleton que gestiona la lista de ramas, maneja el almacenamiento en `localStorage` y limita el historial a 10 registros.

### 2. Capa de Interfaz (Componentes Vue)
- **`App.vue`**: El contenedor principal, orquestando el estado y el diseño.
- **`BranchForm.vue`**: Maneja la entrada del usuario y emite los datos para ser procesados.
- **`BranchList.vue` / `BranchItem.vue`**: Muestran los registros históricos.
- **`Footer.vue`**: Información estática sobre el proyecto y la licencia.

### 3. Localización
- **`i18n/`**: Contiene los archivos JSON de traducción y la configuración para `vue-i18n`.

## 🔒 Privacidad y Datos
Ningún dato sale del navegador del usuario. No utilizamos APIs externas ni servicios de rastreo. Todo se almacena en el `localStorage` del navegador.
