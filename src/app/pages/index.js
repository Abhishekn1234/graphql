
import { useQuery } from '@apollo/client';
import { GET_TASKS } from '@/graphql/queries';
import Link from 'next/link';

export default function Home() {
  const { loading, error, data } = useQuery(GET_TASKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading tasks</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Task List</h1>
      <Link href="/add">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Task</button>
      </Link>
      <ul className="mt-4">
        {data.tasks.map((task) => (
          <li key={task._id} className="border p-2 my-2 rounded">
            <Link href={`/task/${task._id}`}>
              <div className="cursor-pointer">
                <h2 className="text-lg font-semibold">{task.title}</h2>
                <p>Status: {task.status}</p>
                <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
