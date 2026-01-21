import { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import KanbanBoard from "../components/KanbanBoard";
import CreateTask from "../components/CreateTask";
import { createTask, fetchTasks, updateTask, deleteTask } from "../services/taskApi";

export default function Dashboard() {
  const [view, setView] = useState("list");
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    setIsLoading(true);
    const data = await fetchTasks();
    setTasks(data);
    setIsLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">TaskFlow</h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView("list")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${view === "list"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    List
                  </span>
                </button>
                <button
                  onClick={() => setView("kanban")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${view === "kanban"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                    Board
                  </span>
                </button>
              </div>

              {/* Logout */}
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
            <p className="text-gray-500 mt-1">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"} total
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium rounded-lg shadow-md hover:from-teal-500 hover:to-emerald-500 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>

        {/* Mobile View Toggle */}
        <div className="sm:hidden flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setView("list")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${view === "list"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600"
              }`}
          >
            List View
          </button>
          <button
            onClick={() => setView("kanban")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${view === "kanban"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600"
              }`}
          >
            Board View
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : view === "list" ? (
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
      </main>

      {/* Create Task Modal */}
      {showForm && (
        <CreateTask
          addTask={addTask}
          close={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
