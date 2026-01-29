import { useEffect } from 'react';
import { ApiKeyModal } from './components/Auth/ApiKeyModal';
import { ChatPanel } from './components/Chat/ChatPanel';
import { PreviewPanel } from './components/Preview/PreviewPanel';
import { useAuthStore } from './stores/authStore';
import { usePresentationStore } from './stores/presentationStore';
import { apiClient } from './lib/api';

function App() {
  const { apiKey } = useAuthStore();
  const { currentHTML, reset } = usePresentationStore();

  useEffect(() => {
    if (apiKey) {
      apiClient.setApiKey(apiKey);
    }
  }, [apiKey]);

  const handleNewPresentation = () => {
    if (confirm('Start a new presentation? Current work will be lost.')) {
      reset();
      window.location.reload();
    }
  };

  const handleExport = () => {
    if (currentHTML) {
      const blob = new Blob([currentHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `presentation-${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <ApiKeyModal />

      {apiKey && (
        <>
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  ✨ Spark
                </h1>
                <p className="text-sm text-gray-500">
                  AI-Powered Presentation Builder
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleNewPresentation}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  New Presentation
                </button>
                <button
                  onClick={handleExport}
                  disabled={!currentHTML}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Export HTML
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Chat Panel */}
            <div className="w-[400px] border-r border-gray-200">
              <ChatPanel />
            </div>

            {/* Preview Panel */}
            <div className="flex-1">
              <PreviewPanel />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
