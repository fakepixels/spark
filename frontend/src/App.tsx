import { useEffect } from 'react';
import { ApiKeyModal } from './components/Auth/ApiKeyModal';
import { ChatPanel } from './components/Chat/ChatPanel';
import { useAuthStore } from './stores/authStore';
import { apiClient } from './lib/api';

function App() {
  const { apiKey } = useAuthStore();

  useEffect(() => {
    if (apiKey) {
      apiClient.setApiKey(apiKey);
    }
  }, [apiKey]);

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
                <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                  New Presentation
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
            <div className="flex-1 bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-2">Preview Coming Soon</h3>
                <p className="text-sm">
                  Your presentation preview will appear here
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
