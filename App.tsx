
import React, { useState } from 'react';
import BudgetDashboard from './components/BudgetDashboard';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    return <BudgetDashboard />;
  }
  
  return <LandingPage onLogin={handleLogin} />;
};

export default App;
