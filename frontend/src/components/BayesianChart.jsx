import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function BayesianChart() {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 10,
            family: 'Arial',
          },
        },
      },
      title: {
        display: true,
        text: '贝叶斯概率分布演变',
        font: {
          size: 12,
          family: 'Arial',
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '参数值',
          font: {
            size: 10,
          },
        },
        min: 0,
        max: 5,
      },
      y: {
        title: {
          display: true,
          text: '概率密度',
          font: {
            size: 10,
          },
        },
        min: 0,
        max: 0.8,
      },
    },
  };

  const data = {
    datasets: [
      {
        label: '先验概率 P(A)',
        data: Array.from({ length: 50 }, (_, i) => ({
          x: i / 10,
          y: Math.exp(-Math.pow(i / 10 - 2.5, 2) / 2) / Math.sqrt(2 * Math.PI),
        })),
        backgroundColor: 'rgba(49, 130, 206, 0.7)',
        pointRadius: 3,
      },
      {
        label: '似然度 P(B|A)',
        data: Array.from({ length: 50 }, (_, i) => ({
          x: i / 10,
          y: Math.exp(-Math.pow(i / 10 - 3.0, 2) / 1) / Math.sqrt(1 * Math.PI),
        })),
        backgroundColor: 'rgba(229, 62, 62, 0.7)',
        pointRadius: 3,
      },
      {
        label: '后验概率 P(A|B)',
        data: Array.from({ length: 50 }, (_, i) => ({
          x: i / 10,
          y: Math.exp(-Math.pow(i / 10 - 2.8, 2) / 0.5) / Math.sqrt(0.5 * Math.PI),
        })),
        backgroundColor: 'rgba(20, 83, 45, 0.8)',
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="bg-white p-5 journal-border rounded mb-6">
      <h4 className="font-bold mb-4 text-journal-primary">贝叶斯推理模型可视化</h4>

      <div className="bg-journal-secondary p-4 rounded mb-4 h-64 flex items-center justify-center">
        <Scatter options={options} data={data} />
      </div>

      <div className="text-sm">
        <p className="font-medium text-journal-highlight mb-2">贝叶斯定理数学表达式：</p>
        <p className="math-notion text-journal-primary mb-2">$P(A|B) = \frac&#123;P(B|A) \cdot P(A)&#125;&#123;P(B)&#125;$</p>
        <p className="text-xs text-journal-muted">
          后验概率 = (似然度 × 先验概率) / 证据因子，广泛应用于概率推理和机器学习模型
        </p>
      </div>
    </div>
  );
}

export default BayesianChart;
