"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface Child {
  _id: string;
  childName: string;
}

interface Medication {
  _id?: string;
  name: string;
  dosage: string;
  frequency: string;
  courseDays: number;
  nextDose: string;
}

const MedicationsPage = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    courseDays: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && session?.user?.id && children.length === 0) {
      fetchChildren(session.user.id);
    }
  }, [isAuthenticated, session?.user?.id, children.length]);

  useEffect(() => {
    if (selectedChild) {
      fetchMedications(selectedChild);
    }
  }, [selectedChild]);

  // ✅ Fetch children belonging to the logged-in user
  const fetchChildren = async (userId: string) => {
    try {
      const res = await fetch(`/api/user-children?userId=${userId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch children.");

      setChildren(data);

      if (data.length > 0){
         setSelectedChild(data[0]._id); // Auto-select first child
         fetchMedications(data[0]._id);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // ✅ Fetch medications for the selected child
  const fetchMedications = async (childId: string) => {

    if (!childId) {
      console.error("No Child selected, skipping medication fetch");
      return;
    }

    console.log(`Fetching medications for child ID: ${childId}`);

    try {
      const res = await fetch(`/api/medications?childId=${childId}`);
      const data = await res.json();

      console.log("Fetched Medications:", data);

      if (!res.ok) throw new Error(data.error || "Failed to fetch medications.");
      setMedications(data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // ✅ Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle medication submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    console.log("Submitting Medication for Child ID:", selectedChild);
    if (!selectedChild || !formData.name || !formData.dosage || !formData.frequency || !formData.courseDays) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await fetch("/api/medications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          childId: selectedChild,
          ...formData,
          nextDose: new Date().toISOString(), // Initial next dose time
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add medication.");

      setSuccess("Medication added successfully!");
      setFormData({ name: "", dosage: "", frequency: "", courseDays: "" });
      fetchMedications(selectedChild);
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

              {/* ✅ Show Medications */}
              <section className="bg-[#333] p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                <h2 className="text-2xl text-center font-bold mb-6">
                  Medications for {children.find((c) => c._id === selectedChild)?.childName}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {medications.map((med, index) => (
                    <div key={index} className="bg-[#444] border border-[#555] p-6 rounded-lg text-center shadow-md transition-transform transform hover:-translate-y-1">
                      <h3 className="text-xl font-semibold">{med.name}</h3>
                      <p>Dosage: {med.dosage}</p>
                      <p>Frequency: {med.frequency}</p>
                      <p>Prescribed Course: {med.courseDays} days</p>
                      <p>Next Dose: {med.nextDose}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ✅ Medication Input Form */}
              <section className="mt-8 bg-[#333] p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                <h2 className="text-2xl text-center font-bold mb-6">Add a Medication</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" name="name" placeholder="Medication Name" value={formData.name} onChange={handleChange} required className="w-full p-3 bg-[#444] border border-[#555] rounded-md text-white focus:border-[#888] outline-none" />
                  <input type="text" name="dosage" placeholder="Dosage (e.g., 5ml)" value={formData.dosage} onChange={handleChange} required className="w-full p-3 bg-[#444] border border-[#555] rounded-md text-white focus:border-[#888] outline-none" />
                  <input type="text" name="frequency" placeholder="Frequency (e.g., Every 6 hours)" value={formData.frequency} onChange={handleChange} required className="w-full p-3 bg-[#444] border border-[#555] rounded-md text-white focus:border-[#888] outline-none" />
                  <input type="number" name="courseDays" placeholder="Prescribed Course (in days)" value={formData.courseDays} onChange={handleChange} required className="w-full p-3 bg-[#444] border border-[#555] rounded-md text-white focus:border-[#888] outline-none" />
                  <button type="submit" className="w-full bg-white text-black py-3 rounded-md font-bold hover:bg-gray-300 transition">Add Medication</button>
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

export default MedicationsPage;
