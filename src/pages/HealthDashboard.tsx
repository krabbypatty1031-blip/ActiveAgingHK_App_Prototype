import React, { useState, useEffect } from 'react';
import { Heart, Activity, Footprints, Moon, Download, TrendingUp, AlertTriangle } from 'lucide-react';

interface HealthData {
  heartRate: { value: number; status: 'good' | 'warning' | 'danger' };
  bloodPressure: { systolic: number; diastolic: number; status: 'good' | 'warning' | 'danger' };
  steps: { value: number; goal: number; status: 'good' | 'warning' | 'danger' };
  sleep: { value: number; quality: number; status: 'good' | 'warning' | 'danger' };
}

const HealthDashboard: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: { value: 72, status: 'good' },
    bloodPressure: { systolic: 125, diastolic: 82, status: 'good' },
    steps: { value: 5800, goal: 8000, status: 'warning' },
    sleep: { value: 7.2, quality: 85, status: 'good' }
  });

  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // 每分钟更新一次
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
      case 'warning': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' };
      case 'danger': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };
    }
  };

  const generateHealthReport = () => {
    const report = `
      健康報告 - ${new Date().toLocaleDateString('zh-HK')}
      
      心率：${healthData.heartRate.value} bpm (${getStatusText(healthData.heartRate.status)})
      血壓：${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic} mmHg (${getStatusText(healthData.bloodPressure.status)})
      步數：${healthData.steps.value} 步 (${getStatusText(healthData.steps.status)})
      睡眠：${healthData.sleep.value} 小時，質素 ${healthData.sleep.quality}% (${getStatusText(healthData.sleep.status)})
    `;
    
    alert('健康報告已生成！\n\n' + report);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good': return '正常';
      case 'warning': return '注意';
      case 'danger': return '異常';
      default: return '未知';
    }
  };

  const healthCards = [
    {
      title: '心率',
      icon: Heart,
      value: `${healthData.heartRate.value}`,
      unit: 'bpm',
      status: healthData.heartRate.status,
      description: '心跳正常'
    },
    {
      title: '血壓',
      icon: Activity,
      value: `${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic}`,
      unit: 'mmHg',
      status: healthData.bloodPressure.status,
      description: '血壓穩定'
    },
    {
      title: '步數',
      icon: Footprints,
      value: `${healthData.steps.value}`,
      unit: '步',
      status: healthData.steps.status,
      description: `目標 ${healthData.steps.goal} 步`
    },
    {
      title: '睡眠',
      icon: Moon,
      value: `${healthData.sleep.value}`,
      unit: '小時',
      status: healthData.sleep.status,
      description: `質素 ${healthData.sleep.quality}%`
    }
  ];

  return (
    <div className="min-h-screen bg-white p-4">
      {/* 头部 */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">健康儀表板</h1>
        <p className="text-xl text-gray-600">
          最後更新：{lastUpdated.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* 健康数据卡片 */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {healthCards.map((card, index) => {
          const IconComponent = card.icon;
          const statusColor = getStatusColor(card.status);
          
          return (
            <div key={index} className={`${statusColor.bg} ${statusColor.border} border-2 rounded-2xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <IconComponent className={`w-8 h-8 ${statusColor.text} mr-3`} />
                  <h3 className={`text-2xl font-bold ${statusColor.text}`}>{card.title}</h3>
                </div>
                {card.status === 'warning' && <AlertTriangle className="w-6 h-6 text-yellow-600" />}
                {card.status === 'danger' && <AlertTriangle className="w-6 h-6 text-red-600" />}
              </div>
              
              <div className="text-center">
                <div className="flex items-baseline justify-center mb-2">
                  <span className={`text-4xl font-bold ${statusColor.text}`}>{card.value}</span>
                  <span className={`text-xl ml-2 ${statusColor.text}`}>{card.unit}</span>
                </div>
                <p className={`text-lg ${statusColor.text}`}>{card.description}</p>
              </div>
              
              {/* 状态指示器 */}
              <div className="flex justify-center mt-4">
                <div className={`w-4 h-4 rounded-full ${
                  card.status === 'good' ? 'bg-green-500' :
                  card.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 趋势图区域 */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-800">本週趨勢</h3>
          <TrendingUp className="w-6 h-6 text-green-600" />
        </div>
        <div className="h-32 bg-white rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
          <p className="text-xl text-gray-500">心率趨勢圖</p>
        </div>
      </div>

      {/* 生成报告按钮 */}
      <button
        onClick={generateHealthReport}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl p-6 flex items-center justify-center shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <Download className="w-8 h-8 mr-3" />
        <span className="text-2xl font-bold">生成健康報告</span>
      </button>

      {/* 健康建议 */}
      <div className="bg-green-50 rounded-2xl p-6 mt-6">
        <h3 className="text-2xl font-bold text-green-800 mb-3">今日建議</h3>
        <ul className="text-xl text-green-700 space-y-2">
          <li>• 步數未達標，建議飯後散步15分鐘</li>
          <li>• 血壓正常，繼續保持規律作息</li>
          <li>• 睡眠質素良好，今晚可提前半小時休息</li>
        </ul>
      </div>
    </div>
  );
};

export default HealthDashboard;