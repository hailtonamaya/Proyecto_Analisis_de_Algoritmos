import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar'; // Importar Navbar
import HailtonPage from './pages/Hailton'; // Importar las páginas
import RicardoPage from './pages/Ricardo';
import JosePage from './pages/Jose';
import StevePage from './pages/Steve';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="/hailton" element={<HailtonPage />} />
          <Route path="/ricardo" element={<RicardoPage />} />
          <Route path="/jose" element={<JosePage />} />
          <Route path="/steve" element={<StevePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
