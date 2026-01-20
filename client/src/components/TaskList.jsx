import { tasks } from "../data/tasks";

export default function TaskList() {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white p-4 rounded shadow"
        >
          <h3 className="font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
          <span className="text-xs text-blue-600 uppercase">
            {task.status}
          </span>
        </div>
      ))}
    </div>
  );
}
