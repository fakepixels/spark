import { useState } from 'react';
import type { StylePreview } from '../../types';

interface StylePreviewCardProps {
  preview: StylePreview;
  isSelected: boolean;
  onSelect: () => void;
}

export function StylePreviewCard({ preview, isSelected, onSelect }: StylePreviewCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={`border-2 rounded-lg overflow-hidden transition-all cursor-pointer ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-blue-300'
      }`}
      onClick={onSelect}
    >
      <div className="relative bg-gray-100" style={{ height: '200px' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <iframe
          srcDoc={preview.html}
          className="w-full h-full border-none"
          sandbox="allow-same-origin"
          onLoad={() => setIsLoading(false)}
          title={preview.name}
        />
      </div>

      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{preview.name}</h3>
          {isSelected && (
            <svg
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <p className="text-sm text-gray-600">{preview.description}</p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`mt-3 w-full py-2 px-4 rounded-lg transition-colors ${
            isSelected
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isSelected ? 'Selected' : 'Select Style'}
        </button>
      </div>
    </div>
  );
}
