import { useState } from "react";

const columns = [
  {
    id: "todo",
    label: "To Do",
    icon: "📋",
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50/50",
    border: "border-blue-200",
    headerBg: "bg-blue-100"
  },
  {
    id: "inprogress",
    label: "In Progress",
    icon: "🚀",
    gradient: "from-amber-500 to-orange-600",
    bg: "bg-amber-50/50",
    border: "border-amber-200",
    headerBg: "bg-amber-100"
  },
  {
    id: "done",
    label: "Done",
    icon: "✅",
    gradient: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50/50",
    border: "border-emerald-200",
    headerBg: "bg-emerald-100"
  },
];

export default function KanbanBoard({ tasks, updateStatus, onUpdate, onDelete }) {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = "0.5";
    e.target.style.transform = "rotate(2deg)";
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    e.target.style.transform = "rotate(0deg)";
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (draggedTask && draggedTask.status !== newStatus) {
      await updateStatus(draggedTask.id, newStatus);
    }
    setDraggedTask(null);
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditForm({ title: task.title, description: task.description });
  };

  const saveEdit = async (id, status) => {
    await onUpdate(id, { ...editForm, status });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await onDelete(id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);
        const isOver = dragOverColumn === col.id;

        return (
          <div
            key={col.id}
            className={`rounded-2xl border-2 transition-all duration-300 ${col.bg} ${isOver
              ? "border-indigo-400 ring-4 ring-indigo-100 scale-[1.02]"
              : col.border
              }`}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column Header */}
            <div className={`px-4 py-3 rounded-t-xl ${col.headerBg}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{col.icon}</span>
                  <h2 className="font-semibold text-gray-800">{col.label}</h2>
                </div>
                <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full bg-white/60 text-gray-700`}>
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Tasks */}
            <div className="p-3 space-y-3 min-h-[200px]">
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  draggable={editingId !== task.id}
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                  className={`group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${draggedTask?.id === task.id ? "opacity-50 rotate-2" : ""
                    } ${editingId === task.id ? "cursor-default" : "cursor-grab active:cursor-grabbing"}`}
                >
                  {editingId === task.id ? (
                    /* Edit Mode */
                    <div className="p-3 space-y-2">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Title"
                        autoFocus
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                        placeholder="Description"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(task.id, task.status)}
                          className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm truncate mb-1">
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Drag Handle */}
                        <div className="text-gray-300 group-hover:text-gray-400 transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                          </svg>
                        </div>
                      </div>

                      {/* Actions - show on hover */}
                      <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(task)}
                          className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Empty State */}
              {columnTasks.length === 0 && (
                <div className={`flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-xl transition-all ${isOver ? "border-indigo-400 bg-indigo-50/50" : "border-gray-200"
                  }`}>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${col.gradient} flex items-center justify-center mb-3 opacity-50`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400 font-medium">Drop tasks here</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
