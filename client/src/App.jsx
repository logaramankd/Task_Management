import { useState } from 'react'
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

function App() {

  const token = localStorage.getItem("token");

  return token ? <Dashboard /> : <Auth />;
}

export default App
