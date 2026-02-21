import { useState } from "react";
import { useTasks } from "./hooks/useTasks";
import Dashboard from "./components/Dashboard";
import GroupView from "./components/GroupView";
import MembersPanel from "./components/MembersPanel";
import Notification from "./components/Notification";
import "./App.css";

export default function App() {
  const taskCtx = useTasks();
  const [activeView, setActiveView] = useState("dashboard"); // dashboard | group | members
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [notification, setNotification] = useState(null);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const openGroup = (group, member = null) => {
    setSelectedGroup(group);
    setSelectedMember(member);
    setActiveView("group");
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-icon">⚡</span>
          <h1>TaskBot</h1>
          <span className="brand-sub">Gestión de Equipos</span>
        </div>
        <nav className="header-nav">
          <button
            className={`nav-btn ${activeView === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveView("dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-btn ${activeView === "members" ? "active" : ""}`}
            onClick={() => setActiveView("members")}
          >
            👥 Miembros
          </button>
          <button className="nav-btn export-btn" onClick={taskCtx.exportData}>
            💾 Exportar JSON
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeView === "dashboard" && (
          <Dashboard
            groups={taskCtx.groups}
            getStats={taskCtx.getStats}
            onSelectGroup={openGroup}
          />
        )}
        {activeView === "group" && selectedGroup && (
          <GroupView
            group={selectedGroup}
            allGroups={taskCtx.groups}
            selectedMember={selectedMember}
            setSelectedMember={setSelectedMember}
            getTasksForUser={taskCtx.getTasksForUser}
            getTasksForGroup={taskCtx.getTasksForGroup}
            addTask={taskCtx.addTask}
            toggleTask={taskCtx.toggleTask}
            deleteTask={taskCtx.deleteTask}
            updateTask={taskCtx.updateTask}
            onBack={() => setActiveView("dashboard")}
            notify={notify}
          />
        )}
        {activeView === "members" && (
          <MembersPanel
            groups={taskCtx.groups}
            addMember={taskCtx.addMember}
            removeMember={taskCtx.removeMember}
            onViewGroupTasks={openGroup}
            notify={notify}
          />
        )}
      </main>

      {notification && <Notification {...notification} />}
    </div>
  );
}
