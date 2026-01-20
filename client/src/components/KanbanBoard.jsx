
const columns = ["todo", "inprogress", "done"];

export default function KanbanBoard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((col) => (
        <div key={col} className="bg-gray-200 p-3 rounded">
          <h2 className="font-bold mb-2 uppercase">{col}</h2>

          {tasks
            .filter((task) => task.status === col)
            .map((task) => (
              <div
                key={task.id}
                className="bg-white p-3 rounded mb-2 shadow"
              >
                <h3 className="font-semibold">{task.title}</h3>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
