import React, { useState, useEffect } from 'react';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`bg-white border-b border-journal-border sticky top-0 z-50 transition-shadow ${
        isScrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-3 md:mb-0">
          <h1 className="text-xl font-bold text-journal-primary">
            <span className="text-journal-highlight">学术研究</span>期刊
          </h1>
          <span className="ml-2 text-xs text-journal-muted">Advanced Research Journal</span>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="text-journal-highlight hover:underline"
          >
            首页
          </a>
          <a
            href="#research"
            onClick={(e) => handleNavClick(e, '#research')}
            className="text-journal-primary hover:text-journal-highlight hover:underline"
          >
            研究领域
          </a>
          <a
            href="#visualization"
            onClick={(e) => handleNavClick(e, '#visualization')}
            className="text-journal-primary hover:text-journal-highlight hover:underline"
          >
            AI可视化
          </a>
          <a
            href="#articles"
            onClick={(e) => handleNavClick(e, '#articles')}
            className="text-journal-primary hover:text-journal-highlight hover:underline"
          >
            研究论文
          </a>
          <a
            href="#methods"
            onClick={(e) => handleNavClick(e, '#methods')}
            className="text-journal-primary hover:text-journal-highlight hover:underline"
          >
            研究方法
          </a>
          <a
            href="#about"
            onClick={(e) => handleNavClick(e, '#about')}
            className="text-journal-primary hover:text-journal-highlight hover:underline"
          >
            关于期刊
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
