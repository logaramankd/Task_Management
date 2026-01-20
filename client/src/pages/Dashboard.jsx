import { useState } from "react";
import { tasks as initialTasks } from "../data/tasks";
import TaskList from "../components/TaskList";
import KanbanBoard from "../components/KanbanBoard";
import CreateTask from "../components/CreateTask";

export default function Dashboard() {
  const [view, setView] = useState("list");
  const [tasks, setTasks] = useState(initialTasks);
  const [showForm, setShowForm] = useState(false);

  const updateStatus = (id, status) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };
  const addTask = (task) => {
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: task.title,
        description: task.description,
        status: "todo",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <button
          onClick={() => setView(view === "list" ? "kanban" : "list")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Switch to {view === "list" ? "Kanban" : "List"} View
        </button>

      </div>
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 mb-2  bg-green-600 text-white rounded"
      >
        + Add Task
      </button>
      {showForm && (
        <CreateTask
          addTask={addTask}
          close={() => setShowForm(false)}
        />
      )}


      {view === "list" ? (
        <TaskList tasks={tasks} updateStatus={updateStatus} />
      ) : (
        <KanbanBoard tasks={tasks} updateStatus={updateStatus} />
      )}
    </div>
  );
}
