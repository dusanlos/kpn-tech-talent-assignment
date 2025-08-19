import React, { useState } from 'react';
import { User } from 'lucide-react';
import { ApiService } from '../../api/ApiService';

const RegisterForm = ({ onRegister, onSwitchToLogin }) => {
  const [form, setForm] = useState({ username: '', password: '', role: 'USER' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await ApiService.register(form.username, form.password, form.role);
      onRegister();
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
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#00c300]">Create Account</h1>
          <p className="text-[#1297fe] mt-2 font-medium">Register for a new account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#1e1e1e] mb-2">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-4 py-3 border border-[#e2e2e2] rounded-lg bg-[#e2e2e2] text-[#1e1e1e] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1297fe] focus:border-transparent transition duration-200"
              placeholder="Choose a username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1e1e1e] mb-2">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 border border-[#e2e2e2] rounded-lg bg-[#e2e2e2] text-[#1e1e1e] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1297fe] focus:border-transparent transition duration-200"
              placeholder="Create a password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1e1e1e] mb-2">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-4 py-3 border border-[#e2e2e2] rounded-lg bg-[#e2e2e2] text-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#1297fe] focus:border-transparent transition duration-200"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00c300] text-white py-3 rounded-lg hover:bg-[#00b000] transition duration-200 font-medium shadow-md disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onSwitchToLogin}
            className="w-full bg-[#1297fe] text-white py-3 rounded-lg hover:bg-[#0e7ce6] font-medium transition duration-200 shadow-md"
          >
            Already have an account? Sign in here
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;