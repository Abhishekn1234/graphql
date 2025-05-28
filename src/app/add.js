
"use client";
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_TASK } from '@/graphql/mutations';
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
    <div className="p-4">
      <h1 className="text-xl font-bold">Add New Task</h1>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <input type="text" placeholder="Title" required className="border p-2"
          onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea placeholder="Description" required className="border p-2"
          onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
        <input type="date" required className="border p-2"
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        <select className="border p-2"
          onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option>Todo</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Create Task</button>
      </form>
    </div>
  );
}
