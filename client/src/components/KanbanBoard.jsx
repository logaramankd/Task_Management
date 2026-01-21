import { useState } from "react";

const columns = [
  { id: "todo", label: "To Do", color: "bg-blue-50 border-blue-300" },
  { id: "inprogress", label: "In Progress", color: "bg-yellow-50 border-yellow-300" },
  { id: "done", label: "Done", color: "bg-green-50 border-green-300" },
];

export default function KanbanBoard({ tasks, updateStatus, onUpdate, onDelete }) {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    // Add visual feedback
    e.target.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {columns.map((col) => (
        <div
          key={col.id}
          className={`p-4 rounded-lg border-2 min-h-[300px] transition-all ${col.color} ${dragOverColumn === col.id ? "ring-2 ring-blue-500 ring-offset-2" : ""
            }`}
          onDragOver={(e) => handleDragOver(e, col.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, col.id)}
        >
          <h2 className="font-bold mb-3 text-lg flex items-center gap-2">
            {col.label}
            <span className="text-sm font-normal bg-gray-200 px-2 py-0.5 rounded-full">
              {tasks.filter((t) => t.status === col.id).length}
            </span>
          </h2>

          <div className="space-y-2">
            {tasks
              .filter((task) => task.status === col.id)
              .map((task) => (
                <div
                  key={task.id}
                  draggable={editingId !== task.id}
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white p-3 rounded-lg shadow-sm border cursor-grab hover:shadow-md transition-shadow ${draggedTask?.id === task.id ? "opacity-50" : ""
                    } ${editingId === task.id ? "cursor-default" : ""}`}
                >
                  {editingId === task.id ? (
                    /* Edit Mode */
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full p-1.5 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Title"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full p-1.5 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Description"
                        rows={2}
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={() => saveEdit(task.id, task.status)}
                          className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <div>
                      <h3 className="font-semibold text-sm">{task.title}</h3>
                      {task.description && (
                        <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                      )}
                      <div className="flex gap-1 mt-2">
                        <button
                          onClick={() => startEdit(task)}
                          className="px-2 py-0.5 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="px-2 py-0.5 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {tasks.filter((t) => t.status === col.id).length === 0 && (
            <p className="text-gray-400 text-sm text-center py-8">
              Drop tasks here
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
