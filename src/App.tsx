
import AddTask from './components/Tasks/AddTask';
import TaskList from './components/Tasks/TaskList';

export default function App() {
  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task List</h1>
      <AddTask />
      <div className="mt-6">
        <TaskList />
      </div>
    </div>
  );
}
