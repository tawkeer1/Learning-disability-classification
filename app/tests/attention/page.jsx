'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  {
    question: "Select the number 7 in this sequence: 3, 5, 2, 7, 9, 1",
    options: ["3", "7", "2", "5"],
    answer: "7",
  },
  {
    question: "Find the odd one out: cat, dog, apple, horse",
    options: ["dog", "cat", "apple", "horse"],
    answer: "apple",
  },
  {
    question: "What letter comes after 'C'?",
    options: ["B", "D", "E", "A"],
    answer: "D",
  },
];

export default function AttentionTest() {
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
      localStorage.setItem('Attention Span', ((score + (selected === questions[current].answer ? 1 : 0)) / questions.length) * 100);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Attention Span Test</h2>

      {!completed ? (
        <div>
          <p className="text-lg font-medium mb-2">{questions[current].question}</p>
          <div className="space-y-2">
            {questions[current].options.map((opt, index) => (
              <button
                key={index}
                onClick={() => setSelected(opt)}
                className={`block w-full text-left px-4 py-2 rounded border ${
                  selected === opt ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
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
          <p className="text-xl font-semibold text-green-800">Attention Test Completed!</p>
          <button
            onClick={() => router.push('/tests/memory')}
            className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
          >
            Continue to Memory Test
          </button>
        </div>
      )}
    </div>
  );
}
