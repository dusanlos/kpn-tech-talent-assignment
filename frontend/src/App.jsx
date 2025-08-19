import React, { useState, useEffect } from 'react';
import { ApiService } from './api/ApiService';
import LoginForm from './components/auth/LoginForm.jsx';
import RegisterForm from './components/auth/RegisterForm.jsx';
import CustomerList from "./components/customer/CustomerList.jsx";

const App = () => {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = ApiService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ 
          username: payload.sub || 'Unknown User',
          role: payload.role || 'USER'
        });
        setCurrentView('loggedIn'); // user is logged in
      } catch (error) {
        ApiService.removeToken();
        setCurrentView('login');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (loginResponse) => {
    setUser({ 
      username: loginResponse.username,
      role: 'USER'
    });
    setCurrentView('loggedIn');
  };

  const handleRegister = () => {
    alert('Registration successful! Please login with your credentials.');
    setCurrentView('login');
  };

  const handleLogout = () => {
    ApiService.removeToken();
    setUser(null);
    setCurrentView('login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (currentView === 'register') {
    return (
      <RegisterForm 
        onRegister={handleRegister}
        onSwitchToLogin={() => setCurrentView('login')}
      />
    );
  }

  if (currentView === 'login') {
    return (
      <LoginForm 
        onLogin={handleLogin}
        onSwitchToRegister={() => setCurrentView('register')}
      />
    );
  }

  // Show CustomerList when logged in
  if (currentView === 'loggedIn') {
    return (
      <div>
        <div className="flex justify-between items-center p-4 bg-white shadow">
          <h1 className="text-2xl font-bold text-blue-600">
            Welcome, {user?.username || 'User'}!
          </h1>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
        <CustomerList /> {/* <-- render customer list here */}
      </div>
    );
  }

  return null;
};

export default App;