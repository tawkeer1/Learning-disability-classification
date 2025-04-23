'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  {
    question: "What is 12 + 7?",
    options: ["19", "18", "20", "17"],
    answer: "19",
  },
  {
    question: "What is 6 × 3?",
    options: ["18", "16", "21", "15"],
    answer: "18",
  },
  {
    question: "What is 25 - 9?",
    options: ["14", "15", "16", "17"],
    answer: "16",
  },
];

export default function MathTest() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (selected === questions[current].answer) {
      setScore(score + 1);
    }

    setSelected(null);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setCompleted(true);
      // You can store this score globally or in localStorage for final API call
      localStorage.setItem('Math Score', ((score + (selected === questions[current].answer ? 1 : 0)) / questions.length) * 100);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Math Test</h2>

      {!completed ? (
        <div>
          <p className="text-lg font-medium mb-2">
            {questions[current].question}
          </p>
          <div className="space-y-2">
            {questions[current].options.map((opt, index) => (
              <button
                key={index}
                onClick={() => setSelected(opt)}
                className={`block w-full text-left px-4 py-2 rounded border ${
                  selected === opt ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={selected === null}
          >
            {current === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-green-100 rounded">
          <p className="text-xl font-semibold text-green-800">Test Completed!</p>
          <p className="text-green-700">
            Your math score: <strong>{(score / questions.length) * 100}</strong>
          </p>
          <button
            onClick={() => router.push('/tests/reading')} // next test
            className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
          >
            Continue to Reading Test
          </button>
        </div>
      )}
    </div>
  );
}
