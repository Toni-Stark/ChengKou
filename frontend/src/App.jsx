import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ResearchAreas from './components/ResearchAreas';
import Visualization from './components/Visualization';
import Articles from './components/Articles';
import Methods from './components/Methods';
import Sidebar from './components/Sidebar';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import AIDetailPage from './pages/AIDetailPage';
import AerospaceDetailPage from './pages/AerospaceDetailPage';
import AerospaceAlgorithmDetail from './pages/AerospaceAlgorithmDetail';
import AerospaceAlgorithmModelDetail from './pages/AerospaceAlgorithmModelDetail';
import AerospaceTopicDetail from './pages/AerospaceTopicDetail';
import DataScienceDetailPage from './pages/DataScienceDetailPage';
import ComputationalMechanicsDetailPage from './pages/ComputationalMechanicsDetailPage';
import NeuralNetworkVisualization from './pages/NeuralNetworkVisualization';
import DeepLearningVisualization from './pages/DeepLearningVisualization';
import MachineLearningVisualization from './pages/MachineLearningVisualization';
import BayesVisualization from './pages/BayesVisualization';
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
      <ScrollToTop />
      <div className="bg-journal-secondary font-serif text-journal-primary">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ai-detail" element={<AIDetailPage />} />
          <Route path="/aerospace-detail" element={<AerospaceDetailPage />} />
          <Route path="/aerospace-algorithm/:topic" element={<AerospaceAlgorithmDetail />} />
          <Route path="/aerospace-algorithm-model/:topic/:model" element={<AerospaceAlgorithmModelDetail />} />
          <Route path="/aerospace-topic/:topic" element={<AerospaceTopicDetail />} />
          <Route path="/data-science-detail" element={<DataScienceDetailPage />} />
          <Route path="/computational-mechanics-detail" element={<ComputationalMechanicsDetailPage />} />
          <Route path="/neural-network-visualization" element={<NeuralNetworkVisualization />} />
          <Route path="/deep-learning/:topic" element={<DeepLearningVisualization />} />
          <Route path="/machine-learning/:topic" element={<MachineLearningVisualization />} />
          <Route path="/bayes/:topic" element={<BayesVisualization />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
