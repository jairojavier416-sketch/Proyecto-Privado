import "./Dashboard.css";

const PRIORITY_CONFIG = {
  alta:  { color: "#FF4757", label: "Alta",  dot: "🔴" },
  media: { color: "#FFA502", label: "Media", dot: "🟡" },
  baja:  { color: "#2ED573", label: "Baja",  dot: "🟢" },
};

export default function Dashboard({ groups, getStats, onSelectGroup }) {
  const globalStats = groups.reduce(
    (acc, g) => {
      const s = getStats(g.id);
      acc.total += s.total;
      acc.completed += s.completed;
      acc.pending += s.pending;
      acc.alta += s.alta;
      return acc;
    },
    { total: 0, completed: 0, pending: 0, alta: 0 }
  );

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <h2 className="dashboard-title">Centro de Control</h2>
        <p className="dashboard-subtitle">Gestiona los 5 equipos desde un solo lugar</p>
        <div className="global-stats">
          <div className="gstat"><span className="gstat-num">{globalStats.total}</span><span className="gstat-label">Tareas Totales</span></div>
          <div className="gstat accent-green"><span className="gstat-num">{globalStats.completed}</span><span className="gstat-label">Completadas</span></div>
          <div className="gstat accent-yellow"><span className="gstat-num">{globalStats.pending}</span><span className="gstat-label">Pendientes</span></div>
          <div className="gstat accent-red"><span className="gstat-num">{globalStats.alta}</span><span className="gstat-label">Prioridad Alta</span></div>
        </div>
      </div>

      <div className="groups-grid">
        {groups.map((group) => {
          const stats = getStats(group.id);
          const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
          return (
            <div key={group.id} className="group-card" style={{ "--group-color": group.color }}>
              <div className="group-card-header">
                <div className="group-emoji">{group.emoji}</div>
                <div className="group-info">
                  <h3>{group.name}</h3>
                  <span className="member-count">{group.members.length} miembros</span>
                </div>
                <div className="group-badge" style={{ background: group.color + "22", color: group.color }}>
                  {stats.pending} pendientes
                </div>
              </div>

              <div className="progress-bar">
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progress}%`, background: group.color }} />
                </div>
                <span className="progress-label">{progress}% completado</span>
              </div>

              <div className="priority-breakdown">
                {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                  <div key={key} className="priority-chip" style={{ borderColor: cfg.color + "55", color: cfg.color }}>
                    {cfg.dot} <strong>{stats[key]}</strong> {cfg.label}
                  </div>
                ))}
              </div>

              <div className="group-members-preview">
                {group.members.slice(0, 4).map((m) => (
                  <button
                    key={m.id}
                    className="member-avatar"
                    title={`Ver tareas de ${m.name}`}
                    onClick={() => onSelectGroup(group, m)}
                    style={{ background: group.color + "33", borderColor: group.color }}
                  >
                    {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </button>
                ))}
                {group.members.length > 4 && (
                  <span className="member-more">+{group.members.length - 4}</span>
                )}
              </div>

              <div className="group-actions">
                <button className="btn-group-all" onClick={() => onSelectGroup(group, null)}>
                  📋 Ver todas las tareas
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
