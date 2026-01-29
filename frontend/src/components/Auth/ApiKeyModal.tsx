import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { apiClient } from '../../lib/api';

export function ApiKeyModal() {
  const { apiKey, setApiKey, setError, setValidating, isValidating, error } = useAuthStore();
  const [inputValue, setInputValue] = useState('');
  const [showModal, setShowModal] = useState(!apiKey);

  const handleValidate = async () => {
    if (!inputValue.trim()) {
      setError('Please enter an API key');
      return;
    }

    setValidating(true);
    setError(null);

    try {
      const isValid = await apiClient.validateApiKey(inputValue.trim());

      if (isValid) {
        setApiKey(inputValue.trim());
        apiClient.setApiKey(inputValue.trim());
        setShowModal(false);
      } else {
        setError('Invalid API key. Please check and try again.');
      }
    } catch (err) {
      setError('Failed to validate API key. Please try again.');
    } finally {
      setValidating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleValidate();
    }
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Spark
        </h2>
        <p className="text-gray-600 mb-6">
          Enter your Anthropic API key to get started. Your key is stored locally and never sent to our servers.
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-2">
              Anthropic API Key
            </label>
            <input
              id="api-key"
              type="password"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="sk-ant-..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isValidating}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            onClick={handleValidate}
            disabled={isValidating || !inputValue.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isValidating ? 'Validating...' : 'Continue'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Don't have an API key?{' '}
            <a
              href="https://console.anthropic.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Get one here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
