import { useEffect } from 'react';
import { ApiKeyModal } from './components/Auth/ApiKeyModal';
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
    <div className="min-h-screen bg-gray-50">
      <ApiKeyModal />

      {apiKey && (
        <div className="container mx-auto p-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Spark
            </h1>
            <p className="text-gray-600">
              Your API key is configured. Chat interface coming in Phase 2!
            </p>
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800 font-medium">
                ✓ Authentication successful
              </p>
              <p className="text-green-600 text-sm mt-1">
                API Key: {apiKey.substring(0, 20)}...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
