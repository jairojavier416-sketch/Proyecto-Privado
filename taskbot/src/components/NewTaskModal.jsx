import { useState } from "react";
import "./NewTaskModal.css";

const PRIORITY_CFG = {
  alta:  { color: "#FF4757", icon: "🔴" },
  media: { color: "#FFA502", icon: "🟡" },
  baja:  { color: "#2ED573", icon: "🟢" },
};

export default function NewTaskModal({ group, onAdd, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("media");
  const [assignedTo, setAssignedTo] = useState("todos");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) { setError("El título es obligatorio"); return; }
    onAdd({ title: title.trim(), description: description.trim(), priority, assignedTo, createdBy: "admin" });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ "--group-color": group.color }}>
        <div className="modal-header" style={{ borderBottomColor: group.color }}>
          <h3>{group.emoji} Nueva Tarea — {group.name}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label>Título *</label>
            <input
              className="field-input"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(""); }}
              placeholder="¿Qué hay que hacer?"
              autoFocus
            />
            {error && <span className="field-error">{error}</span>}
          </div>

          <div className="field">
            <label>Descripción</label>
            <textarea
              className="field-input field-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles opcionales..."
              rows={3}
            />
          </div>

          <div className="field">
            <label>Prioridad</label>
            <div className="priority-selector">
              {Object.entries(PRIORITY_CFG).map(([key, cfg]) => (
                <button
                  key={key}
                  className={`ps-btn ${priority === key ? "active" : ""}`}
                  style={priority === key ? { background: cfg.color, borderColor: cfg.color, color: "#fff" } : { borderColor: cfg.color + "60", color: cfg.color }}
                  onClick={() => setPriority(key)}
                >
                  {cfg.icon} {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Asignar a</label>
            <select
              className="field-input field-select"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="todos">👥 Todos los miembros del grupo</option>
              {group.members.map((m) => (
                <option key={m.id} value={m.id}>
                  👤 {m.name} ({m.role})
                </option>
              ))}
            </select>
            {assignedTo !== "todos" && (
              <p className="assign-note" style={{ color: group.color }}>
                ⚠️ Esta tarea solo será visible para el miembro seleccionado
              </p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-create" style={{ background: group.color }} onClick={handleSubmit}>
            ✅ Crear Tarea
          </button>
        </div>
      </div>
    </div>
  );
}
