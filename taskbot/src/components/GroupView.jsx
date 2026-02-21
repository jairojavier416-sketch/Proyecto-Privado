import { useState } from "react";
import TaskCard from "./TaskCard";
import NewTaskModal from "./NewTaskModal";
import "./GroupView.css";

const PRIORITIES = ["todas", "alta", "media", "baja"];
const STATUSES  = ["todas", "pendientes", "completadas"];

export default function GroupView({
  group, allGroups, selectedMember, setSelectedMember,
  getTasksForUser, getTasksForGroup,
  addTask, toggleTask, deleteTask, updateTask,
  onBack, notify,
}) {
  const [filterPriority, setFilterPriority] = useState("todas");
  const [filterStatus, setFilterStatus] = useState("todas");
  const [showNewTask, setShowNewTask] = useState(false);

  const filters = { priority: filterPriority, status: filterStatus };

  const tasks = selectedMember
    ? getTasksForUser(group.id, selectedMember.id, filters)
    : getTasksForGroup(group.id, filters);

  const handleAddTask = (taskData) => {
    addTask({ ...taskData, groupId: group.id });
    setShowNewTask(false);
    notify("✅ Tarea creada exitosamente");
  };

  const handleToggle = (taskId) => {
    toggleTask(taskId, selectedMember?.id || "admin");
    notify("🔄 Estado actualizado");
  };

  const handleDelete = (taskId) => {
    deleteTask(taskId);
    notify("🗑️ Tarea eliminada");
  };

  return (
    <div className="group-view">
      <div className="gv-header" style={{ "--group-color": group.color }}>
        <button className="back-btn" onClick={onBack}>← Volver</button>
        <div className="gv-title-block">
          <span className="gv-emoji">{group.emoji}</span>
          <div>
            <h2>{group.name}</h2>
            {selectedMember && (
              <p className="gv-subtitle">
                Viendo tareas de <strong>{selectedMember.name}</strong>
                <button className="clear-member" onClick={() => setSelectedMember(null)}>✕ Ver todas</button>
              </p>
            )}
          </div>
        </div>
        <button className="btn-new-task" onClick={() => setShowNewTask(true)} style={{ background: group.color }}>
          + Nueva Tarea
        </button>
      </div>

      {/* Member selector */}
      <div className="member-tabs">
        <button
          className={`mtab ${!selectedMember ? "active" : ""}`}
          style={!selectedMember ? { borderColor: group.color, color: group.color } : {}}
          onClick={() => setSelectedMember(null)}
        >
          👥 Todos
        </button>
        {group.members.map((m) => (
          <button
            key={m.id}
            className={`mtab ${selectedMember?.id === m.id ? "active" : ""}`}
            style={selectedMember?.id === m.id ? { borderColor: group.color, color: group.color } : {}}
            onClick={() => setSelectedMember(m)}
          >
            {m.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <span className="filter-label">Prioridad:</span>
          {PRIORITIES.map((p) => (
            <button
              key={p}
              className={`filter-btn ${filterPriority === p ? "active" : ""}`}
              onClick={() => setFilterPriority(p)}
              data-priority={p}
            >
              {p === "alta" ? "🔴" : p === "media" ? "🟡" : p === "baja" ? "🟢" : ""}
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <div className="filter-group">
          <span className="filter-label">Estado:</span>
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`filter-btn ${filterStatus === s ? "active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      <div className="tasks-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>No hay tareas con estos filtros</p>
            <button onClick={() => setShowNewTask(true)} style={{ color: group.color }}>
              Crear primera tarea →
            </button>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              group={group}
              allGroups={allGroups}
              onToggle={() => handleToggle(task.id)}
              onDelete={() => handleDelete(task.id)}
              onUpdate={(updates) => updateTask(task.id, updates)}
            />
          ))
        )}
      </div>

      {showNewTask && (
        <NewTaskModal
          group={group}
          onAdd={handleAddTask}
          onClose={() => setShowNewTask(false)}
        />
      )}
    </div>
  );
}
