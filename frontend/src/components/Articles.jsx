import React, { useState, useEffect } from 'react';
import { articlesAPI } from '../services/api';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await articlesAPI.getAll();
        setArticles(response.data.data);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  return (
    <section id="articles" className="mb-12">
      <div className="border-b border-journal-border pb-2 mb-6">
        <h3 className="text-lg font-bold text-journal-primary">最新研究论文</h3>
      </div>

      <div className="space-y-6">
        {articles.map((article) => (
          <article key={article.id} className="bg-white p-4 journal-border rounded journal-article pl-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs bg-journal-secondary text-journal-muted px-2 py-0.5 rounded">
                {article.category}
              </span>
              <span className="text-xs text-journal-muted">
                {article.year} | DOI: {article.doi}
              </span>
            </div>
            <h4 className="font-bold text-base mb-2 hover:text-journal-highlight transition">
              <a href="#">{article.title}</a>
            </h4>
            <p className="text-sm text-journal-muted mb-3 line-clamp-2">{article.abstract}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {article.tags.map((tag, index) => (
                <span key={index} className="text-xs bg-journal-secondary px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-xs text-journal-muted">作者：{article.authors.join(', ')}</div>
          </article>
        ))}
      </div>

      <div className="mt-6 text-center">
        <a
          href="#"
          className="inline-block bg-journal-highlight text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          查看更多论文 <i className="fa fa-angle-right ml-1"></i>
        </a>
      </div>
    </section>
  );
}

export default Articles;
