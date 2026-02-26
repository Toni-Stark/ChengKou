import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ResearchAreas from './components/ResearchAreas';
import Visualization from './components/Visualization';
import Articles from './components/Articles';
import Methods from './components/Methods';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import AIDetailPage from './pages/AIDetailPage';
import AerospaceDetailPage from './pages/AerospaceDetailPage';
import DataScienceDetailPage from './pages/DataScienceDetailPage';
import ComputationalMechanicsDetailPage from './pages/ComputationalMechanicsDetailPage';
import './styles/index.css';

function HomePage() {
  return (
    <>
      <Hero />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <ResearchAreas />
            <Visualization />
            <Articles />
            <Methods />
          </div>
          <div className="lg:w-1/4">
            <Sidebar />
          </div>
        </div>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="bg-journal-secondary font-serif text-journal-primary">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ai-detail" element={<AIDetailPage />} />
          <Route path="/aerospace-detail" element={<AerospaceDetailPage />} />
          <Route path="/data-science-detail" element={<DataScienceDetailPage />} />
          <Route path="/computational-mechanics-detail" element={<ComputationalMechanicsDetailPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
