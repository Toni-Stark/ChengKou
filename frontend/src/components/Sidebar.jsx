import React, { useState, useEffect } from 'react';
import { researchAPI } from '../services/api';

function Sidebar() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await researchAPI.getTags();
        setTags(response.data.data);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };

    fetchTags();
  }, []);

  return (
    <div>
      {/* 期刊信息 */}
      <div className="bg-white p-4 journal-border rounded mb-6">
        <h4 className="font-bold text-journal-primary mb-3 border-b border-journal-border pb-2">关于本刊</h4>
        <p className="text-sm text-journal-muted mb-4">
          《学术研究期刊》专注于人工智能与航天工程交叉领域的前沿研究，致力于发表高质量的原创研究成果和综述文章。
        </p>
        <div className="text-xs text-journal-muted space-y-1">
          <p>
            <i className="fa fa-calendar-o mr-1"></i> 创刊时间：2020年
          </p>
          <p>
            <i className="fa fa-users mr-1"></i> 编委数量：38人
          </p>
          <p>
            <i className="fa fa-file-text-o mr-1"></i> 年发文量：120篇
          </p>
          <p>
            <i className="fa fa-star-o mr-1"></i> 影响因子：4.2
          </p>
        </div>
      </div>

      {/* 热门标签 */}
      <div className="bg-white p-4 journal-border rounded mb-6">
        <h4 className="font-bold text-journal-primary mb-3 border-b border-journal-border pb-2">热门研究标签</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <a
              key={index}
              href="#"
              className="text-xs bg-journal-secondary text-journal-primary px-2 py-1 rounded hover:bg-journal-highlight hover:text-white transition"
            >
              {tag}
            </a>
          ))}
        </div>
      </div>

      {/* 投稿须知 */}
      <div className="bg-white p-4 journal-border rounded mb-6">
        <h4 className="font-bold text-journal-primary mb-3 border-b border-journal-border pb-2">投稿须知</h4>
        <ul className="text-sm text-journal-muted space-y-2">
          <li className="flex items-start">
            <i className="fa fa-check text-journal-highlight mt-0.5 mr-2"></i>
            <span>研究论文字数要求：8000-12000字</span>
          </li>
          <li className="flex items-start">
            <i className="fa fa-check text-journal-highlight mt-0.5 mr-2"></i>
            <span>包含完整的实验数据和可复现代码</span>
          </li>
          <li className="flex items-start">
            <i className="fa fa-check text-journal-highlight mt-0.5 mr-2"></i>
            <span>采用LaTeX排版，符合期刊格式要求</span>
          </li>
          <li className="flex items-start">
            <i className="fa fa-check text-journal-highlight mt-0.5 mr-2"></i>
            <span>同行评审周期：4-6周</span>
          </li>
        </ul>
        <a href="#" className="mt-3 inline-block text-sm text-journal-highlight hover:underline">
          查看完整投稿指南 <i className="fa fa-external-link ml-1"></i>
        </a>
      </div>

      {/* 订阅期刊 */}
      <div className="bg-journal-highlight text-white p-4 rounded mb-6">
        <h4 className="font-bold mb-3">订阅期刊</h4>
        <p className="text-sm text-white/90 mb-4">获取最新研究成果和行业动态，每月推送</p>
        <form className="space-y-2">
          <input
            type="email"
            placeholder="输入您的邮箱地址"
            className="w-full px-3 py-2 text-sm text-journal-primary rounded focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="w-full bg-white text-journal-highlight text-sm py-2 rounded hover:bg-gray-100 transition"
          >
            立即订阅
          </button>
        </form>
      </div>
    </div>
  );
}

export default Sidebar;
