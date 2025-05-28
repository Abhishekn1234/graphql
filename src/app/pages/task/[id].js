"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, gql } from "@apollo/client";

// Query to fetch the task by ID
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

// Mutation to update the task (make sure mutation name matches backend exactly)
export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $title: String!
    $description: String!
    $dueDate: String!
    $status: String!
  ) {
    updateTaskStatus(
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

  // Unwrap params since Next.js app router passes them as a Promise now
  const id = React.use(params).id;

  // Fetch task data by ID
  const { loading, error, data } = useQuery(GET_TASK, { variables: { id } });

  // Setup mutation hook
  const [updateTask, { loading: updating }] = useMutation(UPDATE_TASK);

  // Form state for task fields
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Todo",
  });

  // When data loads, populate the form
  useEffect(() => {
    if (data?.task) {
      setForm({
        title: data.task.title || "",
        description: data.task.description || "",
        dueDate: data.task.dueDate ? data.task.dueDate.split("T")[0] : "",
        status: data.task.status || "Todo",
      });
    }
  }, [data]);

  if (loading) return <p>Loading task...</p>;
  if (error) return <p>Error loading task: {error.message}</p>;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateTask({ variables: { id, ...form } });
      router.push("/"); // Redirect after success
    } catch (err) {
      console.error("Update failed:", err);
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
          disabled={updating}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {updating ? "Updating..." : "Update Task"}
        </button>
      </form>
    </div>
  );
}
