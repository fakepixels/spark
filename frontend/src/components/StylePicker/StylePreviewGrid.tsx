import { useState } from 'react';
import type { StylePreview } from '../../types';
import { StylePreviewCard } from './StylePreviewCard';

interface StylePreviewGridProps {
  previews: StylePreview[];
  onSelect: (styleId: string) => void;
}

export function StylePreviewGrid({ previews, onSelect }: StylePreviewGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (styleId: string) => {
    setSelectedId(styleId);
    onSelect(styleId);
  };

  return (
    <div className="my-4 p-4 bg-white border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Choose Your Style
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {previews.map((preview) => (
          <StylePreviewCard
            key={preview.id}
            preview={preview}
            isSelected={selectedId === preview.id}
            onSelect={() => handleSelect(preview.id)}
          />
        ))}
      </div>

      {selectedId && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-blue-800 font-medium">
            Style selected! Your presentation will be generated with this design.
          </p>
        </div>
      )}
    </div>
  );
}
