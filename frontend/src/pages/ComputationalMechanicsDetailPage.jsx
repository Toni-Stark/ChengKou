import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { researchAPI } from '../services/api';

function ComputationalMechanicsDetailPage() {
  const [mechanicsData, setMechanicsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await researchAPI.getComputationalMechanicsData();
        setMechanicsData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch computational mechanics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="text-center text-journal-primary py-20">加载中...</div>
      </div>
    );
  }

  if (!mechanicsData) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="text-center text-journal-primary py-20">数据加载失败</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8 lg:px-16">
      {/* 返回按钮 */}
      <div className="max-w-7xl mx-auto mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-journal-highlight hover:text-blue-700 transition"
        >
          <i className="fa fa-arrow-left mr-2"></i>
          返回首页
        </Link>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            计算力学核心知识体系
          </h1>
          <p className="text-slate-600 max-w-3xl mx-auto">
            力学、数学、计算机科学的交叉学科，以数值方法求解力学偏微分方程，支撑工程仿真（CAE）发展
          </p>
        </div>

        {/* 核心内容板块 */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
            <i className="fa fa-cubes text-2xl text-blue-600"></i>
            <h2 className="text-xl font-bold text-blue-600">核心内容（四大模块）</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mechanicsData.coreModules.map((module, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-slate-800 mt-5 mb-3 flex items-center gap-2">
                  <i className={`fa ${module.icon} text-indigo-600 text-sm`}></i>
                  {module.title}
                </h3>
                <ul className="space-y-2 pl-2">
                  {module.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 核心方法板块 */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
            <i className="fa fa-calculator text-2xl text-blue-600"></i>
            <h2 className="text-xl font-bold text-blue-600">核心方法</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mechanicsData.coreMethods.map((method, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-4 border border-gray-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">{method.title}</h3>
                <ul className="space-y-2">
                  {method.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                      <i className="fa fa-check text-blue-600 text-xs mt-1"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 经典论文板块 */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
            <i className="fa fa-book text-2xl text-blue-600"></i>
            <h2 className="text-xl font-bold text-blue-600">经典论文</h2>
          </div>

          <div className="space-y-4">
            {mechanicsData.papers.map((paper, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-4 border-l-4 border-blue-600">
                <h3 className="font-semibold text-slate-800 mb-1">{paper.title}</h3>
                <p className="text-sm text-slate-600 mb-2">
                  {paper.author} ({paper.year})
                </p>
                <p className="text-sm text-slate-600">{paper.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 主流软件板块 */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
            <i className="fa fa-laptop text-2xl text-blue-600"></i>
            <h2 className="text-xl font-bold text-blue-600">主流软件</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mechanicsData.software.map((category, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                      <i className="fa fa-cog text-blue-600 text-xs mt-1"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 前沿方向板块 */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
            <i className="fa fa-lightbulb-o text-2xl text-blue-600"></i>
            <h2 className="text-xl font-bold text-blue-600">前沿研究方向</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mechanicsData.frontiers.map((frontier, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-lg p-5 border border-gray-100 hover:border-blue-600 transition-colors"
              >
                <i className={`fa ${frontier.icon} text-blue-600 text-xl mb-2 block`}></i>
                <h4 className="font-semibold text-slate-800 mb-1">{frontier.title}</h4>
                <p className="text-sm text-slate-600">{frontier.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 学习路径板块 */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
            <i className="fa fa-graduation-cap text-2xl text-blue-600"></i>
            <h2 className="text-xl font-bold text-blue-600">学习路径建议</h2>
          </div>

          <ol className="space-y-3 list-decimal pl-5">
            {mechanicsData.learningPath.map((step, index) => (
              <li key={index} className="py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">
                {step}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

export default ComputationalMechanicsDetailPage;
