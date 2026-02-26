import React from 'react';

function CNNVisualization() {
  return (
    <div className="bg-white p-5 journal-border rounded mb-6">
      <h4 className="font-bold mb-4 text-journal-primary">卷积神经网络 (CNN) 结构可视化</h4>

      <div className="bg-journal-secondary p-4 rounded mb-4">
        <svg width="100%" height="250" viewBox="0 0 800 250" className="cnn-visualization">
          {/* 输入层 */}
          <g className="cnn-layer">
            <rect x="50" y="50" width="60" height="150" fill="#EDF2F7" stroke="#3182CE" strokeWidth="1" rx="1" />
            <text x="80" y="35" textAnchor="middle" fontSize="10" fill="#2D3748">
              输入层 (224×224×3)
            </text>
            <rect x="60" y="60" width="15" height="15" fill="#3182CE" opacity="0.7" rx="1" className="cnn-layer" />
            <rect x="80" y="85" width="15" height="15" fill="#3182CE" opacity="0.7" rx="1" className="cnn-layer" />
            <rect x="60" y="110" width="15" height="15" fill="#3182CE" opacity="0.7" rx="1" className="cnn-layer" />
          </g>

          {/* 卷积层1 */}
          <g className="cnn-layer">
            <rect x="200" y="60" width="60" height="130" fill="#F7FAFC" stroke="#3182CE" strokeWidth="1" rx="1" />
            <text x="230" y="45" textAnchor="middle" fontSize="10" fill="#2D3748">
              卷积层1 (112×112×64)
            </text>
            <rect x="210" y="70" width="12" height="12" fill="#3182CE" opacity="0.7" rx="1" className="cnn-layer" />
            <rect x="230" y="92" width="12" height="12" fill="#3182CE" opacity="0.7" rx="1" className="cnn-layer" />
          </g>

          {/* 池化层 */}
          <g className="cnn-layer">
            <rect x="350" y="70" width="60" height="110" fill="#EDF2F7" stroke="#3182CE" strokeWidth="1" rx="1" />
            <text x="380" y="55" textAnchor="middle" fontSize="10" fill="#2D3748">
              池化层 (56×56×64)
            </text>
            <rect x="360" y="80" width="10" height="10" fill="#3182CE" opacity="0.8" rx="1" className="cnn-layer" />
            <rect x="380" y="100" width="10" height="10" fill="#3182CE" opacity="0.8" rx="1" className="cnn-layer" />
          </g>

          {/* 卷积层2 */}
          <g className="cnn-layer">
            <rect x="500" y="65" width="60" height="120" fill="#F7FAFC" stroke="#3182CE" strokeWidth="1" rx="1" />
            <text x="530" y="50" textAnchor="middle" fontSize="10" fill="#2D3748">
              卷积层2 (28×28×128)
            </text>
            <rect x="510" y="75" width="8" height="8" fill="#3182CE" opacity="0.8" rx="1" className="cnn-layer" />
            <rect x="530" y="93" width="8" height="8" fill="#3182CE" opacity="0.8" rx="1" className="cnn-layer" />
          </g>

          {/* 全连接层 */}
          <g className="cnn-layer">
            <rect x="650" y="50" width="60" height="150" fill="#EDF2F7" stroke="#3182CE" strokeWidth="1" rx="1" />
            <text x="680" y="35" textAnchor="middle" fontSize="10" fill="#2D3748">
              全连接层 (1000×1)
            </text>
            <circle cx="665" cy="70" r="3" fill="#E53E3E" className="cnn-layer" />
            <circle cx="675" cy="90" r="3" fill="#E53E3E" className="cnn-layer" />
            <circle cx="685" cy="110" r="3" fill="#E53E3E" className="cnn-layer" />
            <circle cx="675" cy="130" r="3" fill="#E53E3E" className="cnn-layer" />
            <circle cx="665" cy="150" r="3" fill="#E53E3E" className="cnn-layer" />
          </g>

          {/* 连接线 */}
          <line x1="110" y1="125" x2="200" y2="125" stroke="#3182CE" strokeWidth="1" strokeDasharray="3,2" className="cnn-layer" />
          <line x1="260" y1="125" x2="350" y2="125" stroke="#3182CE" strokeWidth="1" strokeDasharray="3,2" className="cnn-layer" />
          <line x1="410" y1="125" x2="500" y2="125" stroke="#3182CE" strokeWidth="1" strokeDasharray="3,2" className="cnn-layer" />
          <line x1="560" y1="125" x2="650" y2="125" stroke="#3182CE" strokeWidth="1" strokeDasharray="3,2" className="cnn-layer" />
        </svg>
      </div>

      <div className="text-sm">
        <p className="font-medium text-journal-highlight mb-2">卷积操作数学表达式：</p>
        <p className="math-notion text-journal-primary mb-2">
          $y_&#123;i,j&#125; = \sum_&#123;m=0&#125;^&#123;k_h-1&#125; \sum_&#123;n=0&#125;^&#123;k_w-1&#125; x_&#123;i+m,j+n&#125; \cdot w_&#123;m,n&#125; + b$
        </p>
        <p className="text-xs text-journal-muted">
          其中：$x$ 为输入特征图，$w$ 为卷积核权重，$b$ 为偏置项，$k_h, k_w$ 为卷积核高宽
        </p>
      </div>
    </div>
  );
}

export default CNNVisualization;
