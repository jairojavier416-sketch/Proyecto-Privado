import { useState } from "react";
import "./MembersPanel.css";

const ROLES = ["Líder", "Desarrollador", "Diseñador", "Analista", "QA", "DevOps", "Frontend", "Backend", "Scrum Master", "Otro"];

export default function MembersPanel({ groups, addMember, removeMember, onViewGroupTasks, notify }) {
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || "");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "Desarrollador", email: "" });
  const [confirmRemove, setConfirmRemove] = useState(null);

  const currentGroup = groups.find((g) => g.id === selectedGroupId);

  const handleAdd = () => {
    if (!form.name.trim()) return notify("El nombre es obligatorio", "error");
    addMember(selectedGroupId, form);
    setForm({ name: "", role: "Desarrollador", email: "" });
    setShowForm(false);
    notify(`👤 ${form.name} agregado a ${currentGroup.name}`);
  };

  const handleRemove = (memberId, memberName) => {
    removeMember(selectedGroupId, memberId);
    setConfirmRemove(null);
    notify(`❌ ${memberName} removido del grupo`);
  };

  return (
    <div className="members-panel">
      <div className="mp-header">
        <h2>👥 Gestión de Miembros</h2>
        <p>Administra los integrantes de cada grupo</p>
      </div>

      <div className="group-tabs">
        {groups.map((g) => (
          <button
            key={g.id}
            className={`gtab ${selectedGroupId === g.id ? "active" : ""}`}
            style={selectedGroupId === g.id ? { background: g.color + "22", borderColor: g.color, color: g.color } : {}}
            onClick={() => { setSelectedGroupId(g.id); setShowForm(false); }}
          >
            {g.emoji} {g.name}
            <span className="gtab-count" style={selectedGroupId === g.id ? { background: g.color } : {}}>
              {g.members.length}
            </span>
          </button>
        ))}
      </div>

      {currentGroup && (
        <div className="members-content">
          <div className="members-toolbar">
            <h3 style={{ color: currentGroup.color }}>{currentGroup.emoji} {currentGroup.name}</h3>
            <div className="toolbar-actions">
              <button className="btn-view-tasks" onClick={() => onViewGroupTasks(currentGroup, null)}>
                📋 Ver tareas del grupo
              </button>
              <button
                className="btn-add-member"
                style={{ background: currentGroup.color }}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "✕ Cancelar" : "+ Agregar miembro"}
              </button>
            </div>
          </div>

          {showForm && (
            <div className="add-member-form" style={{ borderColor: currentGroup.color + "40" }}>
              <h4>Nuevo Miembro</h4>
              <div className="form-row">
                <div className="field">
                  <label>Nombre completo *</label>
                  <input
                    className="f-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ej: María López"
                  />
                </div>
                <div className="field">
                  <label>Rol</label>
                  <select className="f-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Email</label>
                  <input
                    className="f-input"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@equipo.com"
                  />
                </div>
              </div>
              <button className="btn-confirm-add" style={{ background: currentGroup.color }} onClick={handleAdd}>
                ✅ Confirmar
              </button>
            </div>
          )}

          <div className="members-list">
            {currentGroup.members.length === 0 ? (
              <div className="empty-members">
                <span>🤷</span>
                <p>Este grupo no tiene miembros aún</p>
              </div>
            ) : (
              currentGroup.members.map((member) => (
                <div key={member.id} className="member-row" style={{ "--group-color": currentGroup.color }}>
                  <div className="member-avatar-lg" style={{ background: currentGroup.color + "22", color: currentGroup.color }}>
                    {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="member-details">
                    <span className="member-name">{member.name}</span>
                    <span className="member-role">{member.role}</span>
                    {member.email && <span className="member-email">✉️ {member.email}</span>}
                  </div>
                  <div className="member-actions">
                    <button className="btn-view-member" onClick={() => onViewGroupTasks(currentGroup, member)}
                      style={{ color: currentGroup.color, borderColor: currentGroup.color + "50" }}>
                      Ver tareas
                    </button>
                    {confirmRemove === member.id ? (
                      <div className="confirm-remove">
                        <span>¿Eliminar?</span>
                        <button className="btn-confirm-yes" onClick={() => handleRemove(member.id, member.name)}>Sí</button>
                        <button className="btn-confirm-no" onClick={() => setConfirmRemove(null)}>No</button>
                      </div>
                    ) : (
                      <button className="btn-remove" onClick={() => setConfirmRemove(member.id)}>🗑️</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
