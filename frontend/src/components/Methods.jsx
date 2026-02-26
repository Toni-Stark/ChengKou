import React, { useState, useEffect } from 'react';
import { researchAPI } from '../services/api';

function Methods() {
  const [methods, setMethods] = useState({ aiExplainability: [], researchTools: [] });

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const response = await researchAPI.getMethods();
        setMethods(response.data.data);
      } catch (error) {
        console.error('Failed to fetch methods:', error);
      }
    };

    fetchMethods();
  }, []);

  return (
    <section id="methods" className="mb-12">
      <div className="border-b border-journal-border pb-2 mb-6">
        <h3 className="text-lg font-bold text-journal-primary">研究方法与工具</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 journal-border rounded">
          <h4 className="font-bold mb-3 text-journal-primary">AI模型可解释性方法</h4>
          <ul className="space-y-2 text-sm">
            {methods.aiExplainability.map((method, index) => (
              <li key={index} className="flex items-start">
                <i className="fa fa-circle text-journal-highlight text-xs mt-1 mr-2"></i>
                <div>
                  <span className="font-medium">{method.title}：</span>
                  <span className="text-journal-muted">{method.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 journal-border rounded">
          <h4 className="font-bold mb-3 text-journal-primary">学术研究工具集</h4>
          <ul className="space-y-2 text-sm">
            {methods.researchTools.map((tool, index) => (
              <li key={index} className="flex items-start">
                <i className="fa fa-circle text-journal-highlight text-xs mt-1 mr-2"></i>
                <div>
                  <span className="font-medium">{tool.title}：</span>
                  <span className="text-journal-muted">{tool.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Methods;
