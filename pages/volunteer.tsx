"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

type FoodDeliveryTask = {
  id: string;
  donorName: string;
  recipientName: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: "Pending" | "Assigned" | "Accepted" | "In Progress" | "Completed";
};

// Removed unused Link and STATUS_OPTIONS

export default function VolunteerDriverDashboard() {
  const [tasks, setTasks] = useState<FoodDeliveryTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/volunteer/tasks");
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error");
      }
      setLoading(false);
    }
    fetchTasks();
  }, []);

  async function updateStatus(taskId: string, newStatus: FoodDeliveryTask["status"]) {
    setError("");
    try {
      const res = await fetch(`/api/volunteer/tasks/${taskId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setTasks(tasks => tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{fontFamily: 'Inter, Arial, Helvetica, sans-serif'}}>
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} onClick={() => window.location.href = '/volunteer'}>
          <Image src="/truck-icon.png" alt="FoodChain Icon" width={120} height={120} style={{objectFit: 'contain'}} />
        </button>
        <span className="text-red-700 font-bold text-2xl">FoodChain</span>
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-10 border border-gray-200 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Volunteer Driver Dashboard</h1>
          {loading ? (
            <div className="text-gray-500">Loading tasks...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : tasks.length === 0 ? (
            <div className="text-gray-500">No delivery tasks assigned.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4">Donor</th>
                  <th className="py-2 px-4">Recipient</th>
                  <th className="py-2 px-4">Pickup Address</th>
                  <th className="py-2 px-4">Delivery Address</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} className="border-b">
                    <td className="py-2 px-4">{task.donorName}</td>
                    <td className="py-2 px-4">{task.recipientName}</td>
                    <td className="py-2 px-4">{task.pickupAddress}</td>
                    <td className="py-2 px-4">{task.deliveryAddress}</td>
                    <td className="py-2 px-4 font-semibold text-red-700">{task.status}</td>
                    <td className="py-2 px-4">
                      {task.status === "Assigned" && (
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onClick={() => updateStatus(task.id, "In Progress")}>Pick Up</button>
                      )}
                      {task.status === "In Progress" && (
                        <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => updateStatus(task.id, "Completed")}>Mark Delivered</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
