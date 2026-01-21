import { useState } from "react";

export default function TaskList({ tasks, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", status: "" });

  if (tasks == null) {
    return <p className="text-gray-500">Tasks not loaded</p>;
  }

  if (!Array.isArray(tasks)) {
    return <p className="text-red-500">Invalid tasks data</p>;
  }

  if (tasks.length === 0) {
    return <p className="text-gray-500">No tasks found</p>;
  }

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditForm({
      title: task.title,
      description: task.description,
      status: task.status,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", description: "", status: "" });
  };

  const saveEdit = async (id) => {
    await onUpdate(id, editForm);
    setEditingId(null);
    setEditForm({ title: "", description: "", status: "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await onDelete(id);
    }
  };

  return (
    <div className="space-y-3 mt-4">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white p-4 rounded shadow">
          {editingId === task.id ? (
            /* Edit Mode */
            <div className="space-y-3">
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Title"
              />
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description"
                rows={2}
              />
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todo">Todo</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit(task.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  <span
                    className={`inline-block mt-2 text-xs px-2 py-1 rounded uppercase font-medium ${task.status === "done"
                        ? "bg-green-100 text-green-800"
                        : task.status === "inprogress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(task)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
