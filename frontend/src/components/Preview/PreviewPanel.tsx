import { usePresentationStore } from '../../stores/presentationStore';
import { IframePreview } from './IframePreview';

export function PreviewPanel() {
  const { currentHTML, generationProgress } = usePresentationStore();

  if (generationProgress) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {generationProgress.stage}
          </h3>
          <p className="text-gray-600 mb-4">{generationProgress.message}</p>
          {generationProgress.currentSlide && generationProgress.totalSlides && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{
                  width: `${
                    (generationProgress.currentSlide /
                      generationProgress.totalSlides) *
                    100
                  }%`,
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return <IframePreview html={currentHTML} />;
}
