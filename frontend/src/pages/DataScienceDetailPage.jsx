import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { researchAPI } from '../services/api';

function DataScienceDetailPage() {
  const [dataScienceData, setDataScienceData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await researchAPI.getDataScienceData();
        setDataScienceData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch data science data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterPapers = (paper) => {
    if (activeCategory === 'all') return true;
    return paper.category === activeCategory;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="text-center text-journal-primary py-20">加载中...</div>
      </div>
    );
  }

  if (!dataScienceData) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="text-center text-journal-primary py-20">数据加载失败</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 返回按钮 */}
      <div className="container mx-auto px-4 py-6">
        <Link
          to="/"
          className="inline-flex items-center text-journal-highlight hover:text-blue-700 transition"
        >
          <i className="fa fa-arrow-left mr-2"></i>
          返回首页
        </Link>
      </div>

      <main className="container mx-auto px-4 pb-8">
        {/* 核心相关学科 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all hover:shadow-lg">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fa fa-book text-blue-600"></i>
            核心相关学科
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dataScienceData.disciplines.map((discipline, index) => (
              <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">{discipline.title}</h3>
                <ul>
                  {discipline.items.map((item, idx) => (
                    <li key={idx} className="py-1 border-l-2 border-blue-300 pl-3 my-1 hover:bg-slate-50">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 核心课程体系 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all hover:shadow-lg">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fa fa-graduation-cap text-green-600"></i>
            核心课程体系
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {dataScienceData.courses.map((course, index) => (
              <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-green-600 mb-2">{course.title}</h3>
                <ul>
                  {course.items.map((item, idx) => (
                    <li key={idx} className="py-1 border-l-2 border-green-300 pl-3 my-1 hover:bg-slate-50">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 核心技能树 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all hover:shadow-lg">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fa fa-code text-purple-600"></i>
            核心技能树
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {dataScienceData.skills.map((skill, index) => (
              <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-purple-600 mb-2">{skill.title}</h3>
                <ul>
                  {skill.items.map((item, idx) => (
                    <li key={idx} className="py-1 border-l-2 border-purple-300 pl-3 my-1 hover:bg-slate-50">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 经典论文推荐 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all hover:shadow-lg">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fa fa-file-text-o text-orange-600"></i>
            经典论文推荐
          </h2>

          {/* 分类标签 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {dataScienceData.paperCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* 论文列表 */}
          <div className="space-y-4">
            {dataScienceData.papers.filter(filterPapers).map((paper, index) => (
              <div
                key={index}
                className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{paper.title}</h3>
                <p className="text-sm text-slate-600 mb-2">
                  <strong>作者：</strong>{paper.authors} | <strong>年份：</strong>{paper.year}
                </p>
                <p className="text-sm text-slate-700">{paper.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default DataScienceDetailPage;
