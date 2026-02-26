import React from 'react';

function Footer() {
  return (
    <footer className="bg-journal-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div>
            <h4 className="font-bold mb-3 text-white">学术研究期刊</h4>
            <p className="text-white/70 mb-4">专注于AI与航天领域的学术研究与交流，提供高质量的研究成果发布平台</p>
            <div className="flex space-x-3">
              <a href="#" className="text-white/70 hover:text-white transition">
                <i className="fa fa-twitter"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-white transition">
                <i className="fa fa-facebook"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-white transition">
                <i className="fa fa-linkedin"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-white">快速链接</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-white/70 hover:text-white transition">
                  首页
                </a>
              </li>
              <li>
                <a href="#research" className="text-white/70 hover:text-white transition">
                  研究领域
                </a>
              </li>
              <li>
                <a href="#visualization" className="text-white/70 hover:text-white transition">
                  AI可视化
                </a>
              </li>
              <li>
                <a href="#articles" className="text-white/70 hover:text-white transition">
                  研究论文
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-white">期刊服务</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 hover:text-white transition">
                  论文投稿
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition">
                  同行评审
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition">
                  订阅期刊
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition">
                  过刊浏览
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3 text-white">联系我们</h4>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center space-x-2">
                <i className="fa fa-envelope-o"></i>
                <span>15502354225@163.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fa fa-phone"></i>
                <span>+86 1550 2354 225</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fa fa-map-marker"></i>
                <span>北京市海淀区科研大厦15层</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-6 pt-6 text-center text-white/50 text-xs">
          <p>© 2025 学术研究期刊 版权所有 | ISSN 1234-5678 | 京ICP备12345678号</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
