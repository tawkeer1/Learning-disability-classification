'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  {
    question: "Which word is a synonym for 'Happy'?",
    options: ["Sad", "Joyful", "Angry", "Tired"],
    answer: "Joyful",
  },
  {
    question: "Which word best completes the sentence: 'He ___ the ball into the goal.'",
    options: ["kicked", "kick", "kicking", "kicks"],
    answer: "kicked",
  },
  {
    question: "Choose the antonym of 'Hot'.",
    options: ["Warm", "Cold", "Boiling", "Dry"],
    answer: "Cold",
  },
];

export default function VerbalTest() {
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
      localStorage.setItem('Verbal Reasoning', ((score + (selected === questions[current].answer ? 1 : 0)) / questions.length) * 100);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Verbal Reasoning Test</h2>

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
          <p className="text-xl font-semibold text-green-800">Verbal Test Completed!</p>
          <button
            onClick={() => router.push('/tests/spelling')}
            className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
          >
            Go to Spelling test
          </button>
        </div>
      )}
    </div>
  );
}
