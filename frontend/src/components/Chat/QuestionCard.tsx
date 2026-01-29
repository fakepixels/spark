import { useState } from 'react';
import type { Question } from '../../types';

interface QuestionCardProps {
  question: Question;
  onSelect: (value: string) => void;
}

export function QuestionCard({ question, onSelect }: QuestionCardProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    // Small delay for visual feedback before sending
    setTimeout(() => {
      onSelect(value);
    }, 150);
  };

  return (
    <div className="my-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {question.question}
      </h3>

      <div className="space-y-2">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            disabled={selectedValue !== null}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedValue === option.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            } disabled:cursor-not-allowed`}
          >
            <div className="font-medium text-gray-900 mb-1">
              {option.label}
            </div>
            {option.description && (
              <div className="text-sm text-gray-600">
                {option.description}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
