import { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import KanbanBoard from "../components/KanbanBoard";
import CreateTask from "../components/CreateTask";
import { createTask, fetchTasks, updateTask, deleteTask } from "../services/taskApi";

export default function Dashboard() {
  const [view, setView] = useState("list");
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const loadTasks = async () => {
    const data = await fetchTasks();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (task) => {
    await createTask(task);
    await loadTasks();
    setShowForm(false);
  };

  const handleUpdate = async (id, updates) => {
    await updateTask(id, updates);
    await loadTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    await loadTasks();
  };

  const updateStatus = async (id, status) => {
    await updateTask(id, { status });
    await loadTasks();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <button
          onClick={() => setView(view === "list" ? "kanban" : "list")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Switch to {view === "list" ? "Kanban" : "List"} View
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Add Task
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {showForm && (
        <CreateTask
          addTask={addTask}
          close={() => setShowForm(false)}
        />
      )}

      {view === "list" ? (
        <TaskList
          tasks={tasks}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ) : (
        <KanbanBoard
          tasks={tasks}
          updateStatus={updateStatus}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
