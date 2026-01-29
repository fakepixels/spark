import { useState, useRef, useEffect } from 'react';

interface IframePreviewProps {
  html: string | null;
}

export function IframePreview({ html }: IframePreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (html) {
      setIsLoading(true);
    }
  }, [html]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (!isFullscreen) {
        iframeRef.current.requestFullscreen?.();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    }
  };

  const handleOpenInNewTab = () => {
    if (html) {
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!html) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold mb-2">Preview Coming Soon</h3>
          <p className="text-sm">
            Your presentation preview will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Preview Controls */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Preview</h3>
          <p className="text-xs text-gray-500">
            Use arrow keys to navigate slides
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleOpenInNewTab}
            className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Open in new tab"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
          <button
            onClick={handleFullscreen}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors"
            title="Present fullscreen"
          >
            Present
          </button>
        </div>
      </div>

      {/* Iframe Container */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading presentation...</p>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          srcDoc={html}
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
          onLoad={handleLoad}
          title="Presentation Preview"
        />
      </div>
    </div>
  );
}
