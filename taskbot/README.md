# ⚡ TaskBot — Gestor de Tareas por Equipos

Aplicación React para gestión de tareas con **5 grupos**, **prioridades** (Alta / Media / Baja) y **asignación individual** por miembro.

## ✨ Características

- 📊 **Dashboard global** con estadísticas de todos los grupos
- 👥 **5 grupos** (Alpha, Beta, Gamma, Delta, Omega) definidos en archivos JSON
- 🔴🟡🟢 **Prioridades**: Alta, Media y Baja con filtros visuales
- 👤 **Asignación individual**: si una tarea es solo para una persona, los demás miembros del grupo NO la ven
- ✅ Marcar tareas como completadas con registro de quién la completó
- ✏️ Edición inline de tareas
- 👥 Panel de gestión de miembros (agregar / eliminar)
- 💾 **Exportar JSON** con todos los datos del estado actual
- 💿 Persistencia local con `localStorage`

## 📁 Estructura del Proyecto

```
taskbot/
├── src/
│   ├── data/
│   │   ├── grupo_alpha.json   ← Miembros del Grupo Alpha
│   │   ├── grupo_beta.json    ← Miembros del Grupo Beta
│   │   ├── grupo_gamma.json   ← Miembros del Grupo Gamma
│   │   ├── grupo_delta.json   ← Miembros del Grupo Delta
│   │   ├── grupo_omega.json   ← Miembros del Grupo Omega
│   │   └── tasks.json         ← Tareas de ejemplo iniciales
│   ├── components/
│   │   ├── Dashboard.jsx      ← Vista principal con los 5 grupos
│   │   ├── GroupView.jsx      ← Vista de tareas de un grupo
│   │   ├── TaskCard.jsx       ← Tarjeta individual de tarea
│   │   ├── NewTaskModal.jsx   ← Modal para crear nueva tarea
│   │   ├── MembersPanel.jsx   ← Gestión de miembros
│   │   └── Notification.jsx   ← Notificaciones toast
│   ├── hooks/
│   │   └── useTasks.js        ← Lógica central de tareas
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

## 🚀 Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/taskbot.git
cd taskbot

# 2. Instala dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## 📝 Formato de los archivos JSON de grupos

Cada grupo tiene su propio archivo en `src/data/`:

```json
{
  "id": "alpha",
  "name": "Grupo Alpha",
  "color": "#FF6B6B",
  "emoji": "🔺",
  "members": [
    {
      "id": "alpha_1",
      "name": "Ana García",
      "role": "Líder",
      "email": "ana.garcia@equipo.com"
    }
  ]
}
```

## 📝 Formato de tareas (tasks.json)

```json
{
  "id": "task_001",
  "title": "Nombre de la tarea",
  "description": "Descripción opcional",
  "priority": "alta",          // "alta" | "media" | "baja"
  "groupId": "alpha",          // ID del grupo
  "assignedTo": "todos",       // "todos" | ID del miembro (ej: "alpha_2")
  "createdAt": "2025-02-01T09:00:00Z",
  "completed": false,
  "completedBy": null,
  "completedAt": null,
  "createdBy": "alpha_1"
}
```

## 🔒 Lógica de visibilidad de tareas

| `assignedTo`     | ¿Quién la ve?                          |
|------------------|----------------------------------------|
| `"todos"`        | Todos los miembros del grupo           |
| `"alpha_2"`      | Solo el miembro con ID `alpha_2`       |

## 🛠️ Scripts disponibles

| Comando         | Descripción                       |
|-----------------|-----------------------------------|
| `npm run dev`   | Servidor de desarrollo (HMR)      |
| `npm run build` | Build de producción en `/dist`    |
| `npm run preview` | Preview del build de producción |

## 🏗️ Tecnologías

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- CSS Modules (sin dependencias de estilos externas)
- `localStorage` para persistencia
- Fuentes: Syne + DM Mono (Google Fonts)
