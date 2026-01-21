import { useState } from "react";

export default function CreateTask({ addTask, close }) {
  const [task, setTask] = useState({
    title: "",
    description: "",
  });

  const submit = (e) => {
    e.preventDefault();
    if (!task.title.trim()) return;
    addTask(task);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <form onSubmit={submit} className="bg-white p-6 rounded w-96">
        <h2 className="font-bold mb-4">Create Task</h2>

        <input
          placeholder="Title"
          className="border p-2 w-full mb-3"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="border p-2 w-full mb-3"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={close}>Cancel</button>
          <button className="bg-blue-600 text-white px-3 py-1 rounded">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
