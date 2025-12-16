import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InventoryList from './pages/InventoryList';
import ItemEditor from './pages/ItemEditor';
import Milestone2 from './pages/Milestone2';
import Milestone3 from './pages/Milestone3';
import Milestone4 from './pages/Milestone4';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<InventoryList />} />
          <Route path="/add" element={<ItemEditor />} />
          <Route path="/edit/:id" element={<ItemEditor />} />
          <Route path="/milestone2" element={<Milestone2 />} />
          <Route path="/milestone3" element={<Milestone3 />} />
          <Route path="/milestone4" element={<Milestone4 />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;