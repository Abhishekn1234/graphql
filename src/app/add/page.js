

"use client";
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_TASK } from '../pages/queries';
import { useRouter } from 'next/navigation';

export default function AddTask() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', description: '', status: 'Todo', dueDate: '' });
  const [addTask] = useMutation(ADD_TASK);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTask({ variables: form });
    router.push('/');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-xl font-bold mb-4">Add New Task</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            required
            className="border border-gray-300 p-2 rounded"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            required
            className="border border-gray-300 p-2 rounded"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
          />
          <input
            type="date"
            required
            className="border border-gray-300 p-2 rounded"
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
          <select
            className="border border-gray-300 p-2 rounded"
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            value={form.status}
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
}
