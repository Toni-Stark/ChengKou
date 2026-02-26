import React, { useState, useEffect } from 'react';
import BayesianChart from './BayesianChart';
import CNNVisualization from './CNNVisualization';
import { researchAPI } from '../services/api';

function Visualization() {
  const [aiApplications, setAiApplications] = useState([]);

  useEffect(() => {
    const fetchAIApplications = async () => {
      try {
        const response = await researchAPI.getAIApplications();
        setAiApplications(response.data.data);
      } catch (error) {
        console.error('Failed to fetch AI applications:', error);
      }
    };

    fetchAIApplications();
  }, []);

  return (
    <section id="visualization" className="mb-12">
      <div className="border-b border-journal-border pb-2 mb-6">
        <h3 className="text-lg font-bold text-journal-primary">AI模型可视化</h3>
      </div>

      <CNNVisualization />
      <BayesianChart />

      <div className="bg-white p-5 journal-border rounded">
        <h4 className="font-bold mb-4 text-journal-primary">AI在航天领域的应用</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {aiApplications.map((app) => (
            <div key={app.id} className="p-3 bg-journal-secondary rounded">
              <h5 className="font-medium mb-2 text-journal-highlight">{app.title}</h5>
              <p className="text-journal-muted">{app.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Visualization;
