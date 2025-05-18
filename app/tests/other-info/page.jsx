"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OtherInfoTest() {
  const router = useRouter();

  const [gender, setGender] = useState("");
  const [sleepQuality, setSleepQuality] = useState("");
  const [familyHistory, setFamilyHistory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save individual items to localStorage
    localStorage.setItem("Gender", gender);
    localStorage.setItem("Sleep Quality", sleepQuality);
    localStorage.setItem("Family History", familyHistory === "yes" ? "Yes" : "No");

    // Redirect to results page
    router.push("/results");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Other Information</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Gender */}
        <div>
          <label className="block text-lg font-medium mb-2">Gender</label>
          <select
            className="w-full border p-2 rounded"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Sleep Quality */}
        <div>
          <label className="block text-lg font-medium mb-2">Sleep Quality</label>
          <select
            className="w-full border p-2 rounded"
            value={sleepQuality}
            onChange={(e) => setSleepQuality(e.target.value)}
            required
          >
            <option value="">Select quality</option>
            <option value="Poor">Poor</option>
            <option value="Average">Average</option>
            <option value="Good">Good</option>
          </select>
        </div>

        {/* Family History */}
        <div>
          <label className="block text-lg font-medium mb-2">Family History of Learning Disabilities</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="familyHistory"
                value="yes"
                checked={familyHistory === "yes"}
                onChange={() => setFamilyHistory("yes")}
                required
              />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="familyHistory"
                value="no"
                checked={familyHistory === "no"}
                onChange={() => setFamilyHistory("no")}
              />
              No
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
        >
          Go to results
        </button>
      </form>
    </div>
  );
}
