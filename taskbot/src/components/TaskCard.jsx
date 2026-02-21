import { useState } from "react";
import "./TaskCard.css";

const PRIORITY_CFG = {
  alta:  { color: "#FF4757", bg: "#FF475715", icon: "🔴", label: "Alta" },
  media: { color: "#FFA502", bg: "#FFA50215", icon: "🟡", label: "Media" },
  baja:  { color: "#2ED573", bg: "#2ED57315", icon: "🟢", label: "Baja" },
};

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export default function TaskCard({ task, group, allGroups, onToggle, onDelete, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description);
  const [editPriority, setEditPriority] = useState(task.priority);

  const cfg = PRIORITY_CFG[task.priority];
  const currentGroup = allGroups.find((g) => g.id === task.groupId);
  const assignedMember = task.assignedTo !== "todos"
    ? currentGroup?.members.find((m) => m.id === task.assignedTo)
    : null;

  const saveEdit = () => {
    onUpdate({ title: editTitle, description: editDesc, priority: editPriority });
    setEditing(false);
  };

  return (
    <div
      className={`task-card ${task.completed ? "completed" : ""}`}
      style={{ "--priority-color": cfg.color, "--priority-bg": cfg.bg, "--group-color": group.color }}
    >
      <div className="tc-priority-bar" style={{ background: cfg.color }} />

      <div className="tc-main">
        <div className="tc-check-area">
          <button className={`tc-checkbox ${task.completed ? "checked" : ""}`} onClick={onToggle}
            style={task.completed ? { background: group.color, borderColor: group.color } : {}}>
            {task.completed && "✓"}
          </button>
        </div>

        <div className="tc-content" onClick={() => !editing && setExpanded(!expanded)}>
          {editing ? (
            <div className="edit-form" onClick={(e) => e.stopPropagation()}>
              <input
                className="edit-input"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Título de la tarea"
              />
              <textarea
                className="edit-textarea"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Descripción..."
                rows={2}
              />
              <div className="edit-priority-row">
                <span>Prioridad:</span>
                {["alta", "media", "baja"].map((p) => (
                  <button
                    key={p}
                    className={`ep-btn ${editPriority === p ? "ep-active" : ""}`}
                    style={editPriority === p ? { background: PRIORITY_CFG[p].color, color: "#fff" } : {}}
                    onClick={() => setEditPriority(p)}
                  >
                    {PRIORITY_CFG[p].icon} {p}
                  </button>
                ))}
              </div>
              <div className="edit-actions">
                <button className="btn-save" style={{ background: group.color }} onClick={saveEdit}>Guardar</button>
                <button className="btn-cancel" onClick={() => setEditing(false)}>Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <div className="tc-title-row">
                <span className="tc-title">{task.title}</span>
                <div className="tc-badges">
                  <span className="priority-badge" style={{ color: cfg.color, background: cfg.bg }}>
                    {cfg.icon} {cfg.label}
                  </span>
                  {assignedMember ? (
                    <span className="assign-badge" style={{ borderColor: group.color + "60", color: group.color }}>
                      👤 {assignedMember.name.split(" ")[0]}
                    </span>
                  ) : (
                    <span className="assign-badge assign-all">👥 Todos</span>
                  )}
                </div>
              </div>
              {task.description && (
                <p className={`tc-desc ${expanded ? "expanded" : ""}`}>{task.description}</p>
              )}
              {expanded && (
                <div className="tc-meta">
                  <span>📅 Creado: {formatDate(task.createdAt)}</span>
                  {task.completed && <span>✅ Completado: {formatDate(task.completedAt)}</span>}
                </div>
              )}
            </>
          )}
        </div>

        {!editing && (
          <div className="tc-actions">
            <button className="tc-btn" title="Editar" onClick={(e) => { e.stopPropagation(); setEditing(true); }}>✏️</button>
            <button className="tc-btn tc-btn-del" title="Eliminar" onClick={(e) => { e.stopPropagation(); onDelete(); }}>🗑️</button>
          </div>
        )}
      </div>
    </div>
  );
}
