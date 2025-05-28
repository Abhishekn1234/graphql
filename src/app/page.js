"use client";
import { useState, useEffect } from 'react';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
import Link from 'next/link';

const GET_TASKS = gql`
  query GetTasks {
    getTasks {
      _id
      title
      description
      status
      dueDate
    }
  }
`;

const FILTER_TASKS = gql`
  query FilterTasks($status: String!) {
    filterTasks(status: $status) {
      _id
      title
      description
      status
      dueDate
    }
  }
`;

export default function Home() {
  const { loading: loadingAll, error: errorAll, data: dataAll } = useQuery(GET_TASKS);

  const [filterStatus, setFilterStatus] = useState('All');


  const [
    getFilteredTasks,
    { loading: loadingFiltered, error: errorFiltered, data: dataFiltered },
  ] = useLazyQuery(FILTER_TASKS);

  
  useEffect(() => {
    if (filterStatus !== 'All') {
      getFilteredTasks({ variables: { status: filterStatus } });
    }
  }, [filterStatus, getFilteredTasks]);

  if (loadingAll) return <p>Loading tasks...</p>;
  if (errorAll) return <p>Error loading tasks: {errorAll.message}</p>;

  // Choose data source based on filterStatus
  const tasks =
    filterStatus === 'All'
      ? dataAll?.getTasks || []
      : dataFiltered?.filterTasks || [];

  const loading = filterStatus === 'All' ? loadingAll : loadingFiltered;
  const error = filterStatus === 'All' ? errorAll : errorFiltered;

  const hasTasks = tasks.length > 0;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Task List</h1>

      <div className="flex items-center gap-4 mb-4">
        <Link href="/add">
          <button className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600">
            Add Task
          </button>
        </Link>

       
        <select
          className="border border-gray-300 rounded p-2"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      {loading && <p>Loading filtered tasks...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {!loading && !error && !hasTasks && (
        <p className="mt-2 text-red-500">No tasks available for selected status.</p>
      )}

      {!loading && !error && hasTasks && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left">Title</th>
              <th className="border border-gray-300 p-2 text-left">Status</th>
              <th className="border border-gray-300 p-2 text-left">Due Date</th>
              <th className="border border-gray-300 p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{task.title}</td>
                <td className="border border-gray-300 p-2">{task.status}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(task.dueDate).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <Link href={`/task/${task._id}`}>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                      Edit
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
