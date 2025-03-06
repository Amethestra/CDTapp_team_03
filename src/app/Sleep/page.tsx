"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface Child {
  _id: string;
  childName: string;
}

interface SleepEntry {
  _id?: string;
  date: string;
  sleepHours: number;
  quality: "good" | "medium" | "bad";
}

const SleepTrackingPage = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [sleepData, setSleepData] = useState<SleepEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    sleepHours: "",
    quality: "good",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch children for logged-in user
  useEffect(() => {
    if (isAuthenticated && session?.user?.id) {
      fetchChildren(session.user.id);
    }
  }, [isAuthenticated, session?.user?.id]);

  useEffect(() => {
    if (selectedChild) {
      fetchSleepData(selectedChild);
    }
  }, [selectedChild]);

  // Fetch user's children
  const fetchChildren = async (userId: string) => {
    try {
      const res = await fetch(`/api/user-children?userId=${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch children.");
      setChildren(data);
      if (data.length > 0) setSelectedChild(data[0]._id); // Auto-select first child
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Fetch sleep data for selected child
  const fetchSleepData = async (childId: string) => {
    try {
      const res = await fetch(`/api/sleep?childId=${childId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch sleep data.");
      setSleepData(data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle sleep data submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedChild || !formData.sleepHours) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await fetch("/api/sleep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          childId: selectedChild,
          date: new Date().toISOString().split("T")[0], // Store only the date
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to log sleep data.");

      setSuccess("Sleep data added successfully!");
      setFormData({ sleepHours: "", quality: "good" });
      fetchSleepData(selectedChild);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#212121] text-[#f5f5f5]">
      <main className="flex-grow p-8">
        {isAuthenticated ? (
          children.length > 0 ? (
            <>
              {/* ✅ Child Selection Dropdown */}
              <div className="flex justify-center mb-6">
                <label className="mr-4 text-lg font-bold">Select Child:</label>
                <select
                  className="px-4 py-2 rounded-md bg-gray-700 text-white"
                  value={selectedChild || ""}
                  onChange={(e) => setSelectedChild(e.target.value)}
                >
                  {children.map((child) => (
                    <option key={child._id} value={child._id}>
                      {child.childName}
                    </option>
                  ))}
                </select>
              </div>

              {/* ✅ Sleep Calendar */}
              <section className="bg-[#333] p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
                <h2 className="text-2xl text-center font-bold mb-6">Sleep Tracking</h2>
                <div className="grid grid-cols-7 gap-[5px] p-4">
                  {Array.from({ length: 30 }, (_, i) => {
                    const day = new Date();
                    day.setDate(i + 1);
                    const dateStr = day.toISOString().split("T")[0];
                    const sleepEntry = sleepData.find((entry) => entry.date === dateStr);
                    const sleepColor =
                      sleepEntry?.quality === "good"
                        ? "bg-green-500"
                        : sleepEntry?.quality === "medium"
                        ? "bg-orange-500"
                        : "bg-red-500";

                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`w-14 h-14 rounded-md text-white font-bold ${sleepColor} hover:opacity-80 transition`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* ✅ Sleep Stats */}
              <section className="mt-6 bg-[#333] p-6 rounded-lg shadow-lg max-w-4xl mx-auto text-center">
                <h2 className="text-xl font-bold">Average Sleep Time | Average Sleep Quality</h2>
              </section>

              {/* ✅ Sleep Entry Form */}
              <section className="mt-6 bg-[#333] p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
                <h2 className="text-2xl text-center font-bold mb-4">Log Sleep</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="number"
                    name="sleepHours"
                    placeholder="Sleep Hours"
                    value={formData.sleepHours}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-[#444] border border-[#555] rounded-md text-white focus:border-[#888] outline-none"
                  />
                  <select
                    name="quality"
                    value={formData.quality}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-[#444] border border-[#555] rounded-md text-white focus:border-[#888] outline-none"
                  >
                    <option value="good">Good (No wake-ups)</option>
                    <option value="medium">Medium (Few wake-ups)</option>
                    <option value="bad">Bad (Constant wake-ups)</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full bg-white text-black py-3 rounded-md font-bold hover:bg-gray-300 transition"
                  >
                    Log Sleep
                  </button>
                </form>
              </section>
            </>
          ) : (
            <p className="text-center text-lg">No children found. Please add a child first.</p>
          )
        ) : (
          <p className="text-center text-lg">You must be logged in to view this page.</p>
        )}
      </main>
    </div>
  );
};

export default SleepTrackingPage;
