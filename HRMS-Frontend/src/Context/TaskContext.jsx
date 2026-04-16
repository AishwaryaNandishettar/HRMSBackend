import React, { createContext, useState } from "react";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const updateProgress = (id, progress) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              progress,
              status:
                progress === 100 ? "COMPLETED" : "IN_PROGRESS",
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateProgress }}>
      {children}
    </TaskContext.Provider>
  );
};