import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import FoodCatalog from './components/FoodCatalog';
import Cart from './components/Cart';
import { TokenProvider } from './components/TokenContext';
import Profile from './components/Profile';
import Register from './components/Register';

function App() {
  return (
    <TokenProvider>
    <Router>
      <Routes>
      <Route
            path="/"
            element={<Navigate to="/login" />}
          />
        <Route path="/login" element={<Login />} />
        <Route path="/food-catalog" element={<FoodCatalog />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
    </TokenProvider>
  );
}

export default App;