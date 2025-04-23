'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  {
    question: "Remember this: 7, 3, 9. What was the second number?",
    options: ["7", "3", "9", "6"],
    answer: "3",
  },
  {
    question: "Which of these was NOT in the list: apple, banana, chair, orange?",
    options: ["apple", "banana", "chair", "orange"],
    answer: "chair",
  },
  {
    question: "What comes next: A, B, C, ___?",
    options: ["E", "F", "D", "G"],
    answer: "D",
  },
];

export default function MemoryTest() {
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
      const finalScore = ((score + (selected === questions[current].answer ? 1 : 0)) / questions.length) * 100;
      localStorage.setItem('Memory Retention', finalScore);
      setCompleted(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Memory Test</h2>

      {!completed ? (
        <div>
          <p className="text-lg font-medium mb-2">{questions[current].question}</p>
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
            Your memory score has been saved.
          </p>
          <button
            onClick={() => router.push('/tests/visual')}
            className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
          >
            Continue to Visual Test
          </button>
        </div>
      )}
    </div>
  );
}
