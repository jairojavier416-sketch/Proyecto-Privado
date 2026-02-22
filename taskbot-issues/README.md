# ⚡ TaskBot — Issues de GitHub

Sistema de tareas usando **Issues + Labels** de GitHub. Sin apps, sin instalar nada.

---

## 🚀 Configuración inicial (solo una vez)

### 1. Sube este repo a GitHub
```bash
git add .
git commit -m "feat: configurar taskbot con issues"
git push origin main
```

### 2. Crea los labels automáticamente
```bash
bash setup_labels.sh TU_USUARIO TU_REPO TU_TOKEN
```

> **¿Cómo obtener el token?**
> GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate → marcar `repo`

### 3. Activa los permisos del workflow
Ve a tu repo → **Settings → Actions → General → Workflow permissions**
→ Selecciona **"Read and write permissions"** → Guardar

---

## 📋 Cómo crear una tarea

1. Ve a la pestaña **Issues** de tu repo
2. Pulsa **"New issue"**
3. Elige la plantilla **📋 Nueva Tarea**
4. Rellena el formulario
5. Añade los labels de **grupo** y **prioridad** en el panel derecho
6. Si es solo para una persona, ponla en **Assignees**
7. Pulsa **"Submit new issue"**

---

## 🏷️ Labels disponibles

### Prioridad
| Label | Color | Significado |
|-------|-------|-------------|
| `prioridad: alta` | 🔴 Rojo | Urgente, hay que hacerlo ya |
| `prioridad: media` | 🟡 Naranja | Importante pero no urgente |
| `prioridad: baja` | 🟢 Verde | Se puede hacer cuando haya tiempo |

### Grupos
| Label | Miembros |
|-------|----------|
| `grupo: alpha` | Ana García · Carlos López · Marta Ruiz |
| `grupo: beta` | María Torres · Juan Pérez · Sofía Mendez |
| `grupo: gamma` | Laura Sánchez · Pedro Ramírez · Isabel Vega |
| `grupo: delta` | Roberto Díaz · Elena Gómez · Andrés Castro |
| `grupo: omega` | Valentina Cruz · Miguel Herrera · Natalia Flores |

### Estado
| Label | Significado |
|-------|-------------|
| `estado: pendiente` | ⏳ Sin empezar |
| `estado: en progreso` | 🔄 Alguien trabajando |

---

## 👁️ Ver tareas por grupo o prioridad

En la pestaña **Issues** usa los filtros:

```
label:"grupo: alpha"          → Solo tareas del Grupo Alpha
label:"prioridad: alta"       → Solo tareas urgentes
label:"grupo: beta" label:"prioridad: alta"  → Alta prioridad del Grupo Beta
assignee:nombre_usuario       → Tareas de una persona concreta
```

---

## ✅ Completar una tarea

1. Abre el Issue
2. Pulsa **"Close issue"**
3. El issue **se elimina automáticamente** gracias al workflow ✨

---

## 🔒 Tareas privadas (solo para una persona)

Si la tarea es solo para un miembro del grupo:
- En **Assignees** pon solo a esa persona
- Los demás pueden ver el issue pero sabrán que no es suyo
- Si quieres ocultarlo completamente, usa un repo privado

---

## 📁 Estructura del repo

```
├── .github/
│   ├── workflows/
│   │   └── eliminar-tarea.yml   ← Borra el issue al cerrarlo
│   └── ISSUE_TEMPLATE/
│       └── nueva_tarea.md       ← Plantilla para crear tareas
├── setup_labels.sh              ← Crea todos los labels de una vez
└── README.md
```
