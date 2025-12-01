import type { Priority, Task } from '@/types/types';
import { useTasksStore } from '../../stores/useTasksStore';
import TaskItem from './TaskItem';
import { useOptimistic } from 'react';

export default function TaskList() {
  const tasks = useTasksStore((state) => state.tasks);

  // useOptimistic: base value = tasks array
  const [optimisticTasks, addOptimistic] = useOptimistic<Task[], { id: string; title: string, priority: string }>(
    tasks,
    (current, updated) => current.map((task) => (task.id === updated.id ? { 
      ...task, 
      title: updated.title, 
      priority: updated.priority as Priority
    } : task))
  );

  return (
    <ul className="space-y-2">
      {optimisticTasks.map((task) => (
        <TaskItem key={task.id} task={task} addOptimistic={addOptimistic} />
      ))}
    </ul>
  );
}
