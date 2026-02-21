import { useState, useEffect, useCallback } from "react";
import initialTasks from "../data/tasks.json";
import alphaData from "../data/grupo_alpha.json";
import betaData from "../data/grupo_beta.json";
import gammaData from "../data/grupo_gamma.json";
import deltaData from "../data/grupo_delta.json";
import omegaData from "../data/grupo_omega.json";

export const ALL_GROUPS = [alphaData, betaData, gammaData, deltaData, omegaData];

const STORAGE_TASKS_KEY = "taskbot_tasks";
const STORAGE_GROUPS_KEY = "taskbot_groups";

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving to storage:", e);
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState(() => loadFromStorage(STORAGE_TASKS_KEY, initialTasks));
  const [groups, setGroups] = useState(() => loadFromStorage(STORAGE_GROUPS_KEY, ALL_GROUPS));

  useEffect(() => { saveToStorage(STORAGE_TASKS_KEY, tasks); }, [tasks]);
  useEffect(() => { saveToStorage(STORAGE_GROUPS_KEY, groups); }, [groups]);

  // Get tasks visible to a specific user (or all tasks of a group if no user)
  const getTasksForUser = useCallback((groupId, memberId = null, filters = {}) => {
    return tasks.filter((task) => {
      if (task.groupId !== groupId) return false;
      // Visibility: show if assigned to "todos" or to this specific member
      if (memberId && task.assignedTo !== "todos" && task.assignedTo !== memberId) return false;
      // Priority filter
      if (filters.priority && filters.priority !== "todas" && task.priority !== filters.priority) return false;
      // Status filter
      if (filters.status === "pendientes" && task.completed) return false;
      if (filters.status === "completadas" && !task.completed) return false;
      return true;
    });
  }, [tasks]);

  const getTasksForGroup = useCallback((groupId, filters = {}) => {
    return getTasksForUser(groupId, null, filters);
  }, [getTasksForUser]);

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: `task_${Date.now()}`,
      ...taskData,
      createdAt: new Date().toISOString(),
      completed: false,
      completedBy: null,
      completedAt: null,
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const toggleTask = useCallback((taskId, memberId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: !t.completed,
              completedBy: !t.completed ? memberId : null,
              completedAt: !t.completed ? new Date().toISOString() : null,
            }
          : t
      )
    );
  }, []);

  const deleteTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const updateTask = useCallback((taskId, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)));
  }, []);

  const addMember = useCallback((groupId, memberData) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, members: [...g.members, { id: `${groupId}_${Date.now()}`, ...memberData }] }
          : g
      )
    );
  }, []);

  const removeMember = useCallback((groupId, memberId) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, members: g.members.filter((m) => m.id !== memberId) } : g
      )
    );
  }, []);

  const exportData = useCallback(() => {
    const data = { groups, tasks, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `taskbot_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [groups, tasks]);

  const getStats = useCallback((groupId) => {
    const groupTasks = tasks.filter((t) => t.groupId === groupId);
    return {
      total: groupTasks.length,
      completed: groupTasks.filter((t) => t.completed).length,
      pending: groupTasks.filter((t) => !t.completed).length,
      alta: groupTasks.filter((t) => t.priority === "alta" && !t.completed).length,
      media: groupTasks.filter((t) => t.priority === "media" && !t.completed).length,
      baja: groupTasks.filter((t) => t.priority === "baja" && !t.completed).length,
    };
  }, [tasks]);

  return {
    tasks, groups,
    getTasksForUser, getTasksForGroup,
    addTask, toggleTask, deleteTask, updateTask,
    addMember, removeMember,
    exportData, getStats,
  };
}
