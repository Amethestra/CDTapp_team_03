"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

const ChildDataPage = () => {
  const { data: session, status } = useSession(); // ✅ Get authentication status

  const [formData, setFormData] = useState({
    child_name: "",
    child_sex: "Male",
    child_dob: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ✅ Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.child_name || !formData.child_dob) {
      setError("All fields are required.");
      return;
    }

    if (!session?.user?.id) {
      setError("User not authenticated.");
      return;
    }

    try {
      console.log("Submitting child data:", formData);

      const res = await fetch("/api/childdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id, // ✅ Ensure userId is passed
          childName: formData.child_name,
          birthDate: formData.child_dob, // ✅ Convert to Date in API
          gender: formData.child_sex,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add child data.");

      setSuccess("Child data added successfully!");
      setFormData({ child_name: "", child_sex: "Male", child_dob: "" });
    } catch (err) {
      setError((err as Error).message || "Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#212121] text-[#f5f5f5]">
      <main className="flex-grow flex justify-center items-center p-8">
        {status === "authenticated" ? (
          <section className="bg-[#333] p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h1 className="text-2xl text-center font-bold mb-6">Create a New Child</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {success && <p className="text-green-500 text-center mb-4">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Child Name */}
              <div className="flex flex-col">
                <label htmlFor="child-name" className="font-bold">Child's Name</label>
                <input
                  type="text"
                  id="child-name"
                  name="child_name"
                  value={formData.child_name}
                  onChange={handleChange}
                  required
                  className="p-3 bg-[#444] border border-[#555] rounded-md text-white focus:bg-[#555] focus:border-[#888] outline-none"
                />
              </div>

              {/* Sex */}
              <div className="flex flex-col">
                <label htmlFor="child-sex" className="font-bold">Sex</label>
                <select
                  id="child-sex"
                  name="child_sex"
                  value={formData.child_sex}
                  onChange={handleChange}
                  required
                  className="p-3 bg-[#444] border border-[#555] rounded-md text-white focus:bg-[#555] focus:border-[#888] outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div className="flex flex-col">
                <label htmlFor="child-dob" className="font-bold">Date of Birth</label>
                <input
                  type="date"
                  id="child-dob"
                  name="child_dob"
                  value={formData.child_dob}
                  onChange={handleChange}
                  required
                  className="p-3 bg-[#444] border border-[#555] rounded-md text-white focus:bg-[#555] focus:border-[#888] outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-white text-black py-3 rounded-md font-bold hover:bg-gray-300 transition"
              >
                Create Child
              </button>
            </form>
          </section>
        ) : (
          <p className="text-center text-lg">
            You must be logged in to add child data.{" "}
            <a href="/Login" className="text-blue-400 underline hover:text-blue-600">Login</a>
          </p>
        )}
      </main>

      <footer className="bg-[#181818] text-center py-4 text-white">
        <p>&copy; {new Date().getFullYear()} Ikshana. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ChildDataPage;
