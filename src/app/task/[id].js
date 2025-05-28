"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      _id
      title
      description
      status
      dueDate
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $title: String!
    $description: String!
    $dueDate: String!
    $status: String!
  ) {
    updateTask(
      id: $id
      title: $title
      description: $description
      dueDate: $dueDate
      status: $status
    ) {
      _id
      title
      description
      status
      dueDate
    }
  }
`;

export default function EditTask({ params }) {
  const router = useRouter();
  const { id } = params;

  const { loading, error, data } = useQuery(GET_TASK, { variables: { id } });
  const [updateTask] = useMutation(UPDATE_TASK);

  // Form state initialized empty, will fill when data loads
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Todo",
  });

  // When data loads, populate form
  useEffect(() => {
    if (data?.task) {
      setForm({
        title: data.task.title || "",
        description: data.task.description || "",
        dueDate: data.task.dueDate ? data.task.dueDate.split("T")[0] : "", // format date for input[type=date]
        status: data.task.status || "Todo",
      });
    }
  }, [data]);

  if (loading) return <p>Loading task...</p>;
  if (error) return <p>Error loading task.</p>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTask({
        variables: {
          id,
          ...form,
        },
      });
      router.push("/"); // Redirect after successful update
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update task");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Task</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          Title
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="border p-2 rounded"
            rows={4}
          />
        </label>

        <label className="flex flex-col">
          Due Date
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          Status
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Task
        </button>
      </form>
    </div>
  );
}
