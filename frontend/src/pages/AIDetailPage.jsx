import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { researchAPI } from '../services/api';
import '../styles/ai-mindmap.css';

function AIDetailPage() {
  const [mindMapData, setMindMapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMindMapData = async () => {
      try {
        const response = await researchAPI.getAIMindMap();
        setMindMapData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch AI mind map data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMindMapData();
  }, []);

  const toggleNode = (e) => {
    e.stopPropagation();
    const target = e.currentTarget;
    target.classList.toggle('open');

    const targetId = target.getAttribute('data-target');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.classList.toggle('open');
    }
  };

  const renderNode = (node, level = 1) => {
    const hasChildren = node.children && node.children.length > 0;
    const levelClass = `level-${level}`;

    return (
      <li key={node.id}>
        {hasChildren ? (
          <>
            <span
              className={`collapsible ${levelClass} ${node.defaultOpen ? 'open' : ''}`}
              data-target={`${node.id}-children`}
              onClick={toggleNode}
            >
              {node.title}
            </span>
            <ul
              id={`${node.id}-children`}
              className={`children ${node.defaultOpen ? 'open' : ''}`}
            >
              {node.children.map((child) => renderNode(child, level + 1))}
            </ul>
          </>
        ) : (
          <span>{node.title}</span>
        )}
      </li>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-journal-secondary flex items-center justify-center">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-journal-secondary py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-journal-highlight hover:text-blue-700 transition"
          >
            <i className="fa fa-arrow-left mr-2"></i>
            返回首页
          </Link>
        </div>

        {/* 主容器 */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-journal-primary mb-8">
            人工智能核心概念关系导图
          </h1>

          {mindMapData && (
            <ul className="mind-map">
              {renderNode(mindMapData)}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIDetailPage;
