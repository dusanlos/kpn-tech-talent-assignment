import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { ApiService } from '../../api/ApiService';

const LoginForm = ({ onLogin, onSwitchToRegister }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.login(credentials.username, credentials.password);
      ApiService.setToken(response.token);
      onLogin(response);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md border-2 border-[#00c300]">
        <div className="text-center mb-8">
          <div className="bg-[#00c300] rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-md">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1e1e1e]">Customer Management</h1>
          <p className="text-[#1297fe] mt-2 font-medium">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#1e1e1e] mb-2">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-4 py-3 border border-[#e2e2e2] rounded-lg bg-[#e2e2e2] text-[#1e1e1e] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1297fe] focus:border-transparent transition duration-200"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1e1e1e] mb-2">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-3 border border-[#e2e2e2] rounded-lg bg-[#e2e2e2] text-[#1e1e1e] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1297fe] focus:border-transparent transition duration-200"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1297fe] text-white py-3 rounded-lg hover:bg-[#0e7ce6] transition duration-200 font-medium disabled:opacity-50 shadow-md"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onSwitchToRegister}
            className="w-full bg-[#1297fe] text-white py-3 rounded-lg hover:bg-[#0e7ce6] font-medium transition duration-200 shadow-md"
          >
            Don't have an account? Register here
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;