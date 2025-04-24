'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function StudentInfoForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [enroll, setEnroll] = useState('');
  const [studyClass, setStudyClass] = useState('');
  const router = useRouter();

  const handleStartTest = (e) => {
    e.preventDefault();

    // Store in localStorage
    localStorage.setItem('StudentName', name);
    localStorage.setItem('Age', age);
    localStorage.setItem('studyClass', studyClass);
    localStorage.setItem('Enroll', enroll);
    // Redirect to first test (e.g., Math Test)
    router.push('/tests/maths');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-400 p-6">
      <h1 className="text-3xl font-bold mb-6">Student Information</h1>
      <form onSubmit={handleStartTest} className="bg-gray-500 p-6 rounded-lg shadow-md w-full max-w-md">
        <label className="block mb-4">
          Name:
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </label>
        <label className="block mb-6">
          Age:
          <input
            type="number"
            value={age}
            required
            onChange={(e) => setAge(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </label>
        <label className="block mb-4">
          Class you study:
          <input
            type="text"
            value={studyClass}
            required
            onChange={(e) => setStudyClass(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </label>
        <label className="block mb-4">
          Enroll no.
          <input
            type="number"
            value={enroll}
            required
            onChange={(e) => setEnroll(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </label>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Start Test
        </button>
      </form>
    </div>
  );
}
