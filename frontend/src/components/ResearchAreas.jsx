import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { researchAPI } from '../services/api';
import { SkeletonCard } from './Skeleton';

function ResearchAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await researchAPI.getAreas();
        setAreas(response.data.data);
      } catch (error) {
        console.error('Failed to fetch research areas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  const handleAreaClick = (area) => {
    if (area.detailPage) {
      navigate(area.detailPage);
    }
  };

  return (
    <section id="research" className="mb-12">
      <div className="border-b border-journal-border pb-2 mb-6">
        <h3 className="text-lg font-bold text-journal-primary">核心研究领域</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {loading ? (
          // 加载骨架屏
          <>
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </>
        ) : (
          areas.map((area) => (
          <div
            key={area.id}
            className={`bg-white p-4 journal-border rounded ${
              area.detailPage ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
            }`}
            onClick={() => handleAreaClick(area)}
          >
            <div className="flex items-center mb-3">
              <i className={`fa fa-${area.icon} text-journal-highlight text-xl mr-2`}></i>
              <h4 className="font-bold">{area.title}</h4>
              {area.detailPage && (
                <i className="fa fa-external-link text-journal-muted text-xs ml-auto"></i>
              )}
            </div>
            <p className="text-sm text-journal-muted mb-3">{area.description}</p>
            <div className="flex flex-wrap gap-2">
              {area.tags.map((tag, index) => (
                <span key={index} className="text-xs bg-journal-secondary px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          ))
        )}
      </div>
    </section>
  );
}

export default ResearchAreas;
