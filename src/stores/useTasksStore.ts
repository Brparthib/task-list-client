import type { Task } from "@/types/types";
import { create } from "zustand";

type TasksState = {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTaskOptimistic: (id: string, payload: Partial<Task>) => void;
  rollbackUpdate: (prevTask: Task) => void; // restore previous task
  getTaskById: (id: string) => Task | undefined;
};

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],

  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),

  updateTaskOptimistic: (id, payload) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...payload } : task
      ),
    })),

  rollbackUpdate: (prevTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === prevTask.id ? prevTask : task
      ),
    })),

  getTaskById: (id) => get().tasks.find((task) => task.id === id),
}));
