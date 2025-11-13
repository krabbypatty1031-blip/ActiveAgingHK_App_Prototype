import React, { useState, useEffect } from 'react';
import { Heart, Activity, Footprints, Moon, Download, TrendingUp, Award, Calendar, Clock, Sparkles, Pill, Volume2, ArrowLeft } from 'lucide-react';
import { useAccessibility } from '../components/AccessibilitySettings';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../components/ui/Button';

interface HealthData {
  heartRate: { value: number; status: 'good' | 'warning' | 'danger'; trend: 'up' | 'down' | 'stable' };
  bloodPressure: { systolic: number; diastolic: number; status: 'good' | 'warning' | 'danger' };
  steps: { value: number; goal: number; status: 'good' | 'warning' | 'danger'; progress: number };
  sleep: { value: number; quality: number; status: 'good' | 'warning' | 'danger' };
  medication: { taken: boolean; nextDose: string; timeLeft: string };
}

const ElegantHealthDashboard: React.FC = () => {
  const { speak, fontSize } = useAccessibility();
  const navigate = useNavigate();
  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: { value: 72, status: 'good', trend: 'stable' },
    bloodPressure: { systolic: 125, diastolic: 82, status: 'good' },
    steps: { value: 6800, goal: 8000, status: 'warning', progress: 85 },
    sleep: { value: 7.2, quality: 85, status: 'good' },
    medication: { taken: true, nextDose: '14:00', timeLeft: '2小時後' }
  });

  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [encouragement, setEncouragement] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // 根据健康状态生成鼓励语
    const encouragements = {
      good: [
        '身體狀態良好！繼續保持 💚',
        '今日表現很棒！為您驕傲 ✨',
        '健康指標正常，生活更美好 🌸',
        '您的堅持有了回報！繼續加油 💪'
      ],
      warning: [
        '稍微注意一下，您會更好的 💛',
        '小提醒：多走動對身體有益 🚶‍♀️',
        '今日不錯，明日會更好！ 🌟',
        '慢慢來，健康是一場馬拉松 🏃‍♀️'
      ],
      danger: [
        '請注意休息，身體要緊 ❤️',
        '如有不適，記得聯絡家人 📞',
        '健康第一，其他都不重要 💝',
        '深呼吸，放鬆心情 🧘‍♀️'
      ]
    };

    const overallStatus = getOverallStatus();
    const messages = encouragements[overallStatus];
    setEncouragement(messages[Math.floor(Math.random() * messages.length)]);
  }, [healthData]);

  const getOverallStatus = () => {
    const statuses = [
      healthData.heartRate.status,
      healthData.bloodPressure.status,
      healthData.steps.status,
      healthData.sleep.status
    ];
    
    if (statuses.includes('danger')) return 'danger';
    if (statuses.includes('warning')) return 'warning';
    return 'good';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        accent: 'bg-emerald-500',
        icon: 'text-emerald-600'
      };
      case 'warning': return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        accent: 'bg-amber-500',
        icon: 'text-amber-600'
      };
      case 'danger': return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        accent: 'bg-rose-500',
        icon: 'text-rose-600'
      };
      default: return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        accent: 'bg-gray-500',
        icon: 'text-gray-600'
      };
    }
  };

  const generateHealthReport = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const report = `
        🏥 健康報告 - ${new Date().toLocaleDateString('zh-HK')}
        
        ❤️ 心率：${healthData.heartRate.value} bpm (${getStatusText(healthData.heartRate.status)})
        🩺 血壓：${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic} mmHg (${getStatusText(healthData.bloodPressure.status)})
        👟 步數：${healthData.steps.value}/${healthData.steps.goal} 步 (${getStatusText(healthData.steps.status)})
        😴 睡眠：${healthData.sleep.value} 小時，質素 ${healthData.sleep.quality}% (${getStatusText(healthData.sleep.status)})
        💊 用藥：${healthData.medication.taken ? '已按時服用' : '尚未服用'}
        
        📊 整體評估：${encouragement}
      `;
      
      speak('健康報告已生成完成');
      alert(report);
      setIsLoading(false);
    }, 1500);
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
      description: '心跳正常',
      trend: healthData.heartRate.trend,
      trendText: '穩定'
    },
    {
      title: '血壓',
      icon: Activity,
      value: `${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic}`,
      unit: 'mmHg',
      status: healthData.bloodPressure.status,
      description: '血壓穩定',
      trend: 'stable',
      trendText: '正常'
    },
    {
      title: '步數',
      icon: Footprints,
      value: `${healthData.steps.value}`,
      unit: '步',
      status: healthData.steps.status,
      description: `目標 ${healthData.steps.goal} 步`,
      progress: healthData.steps.progress,
      trend: 'up',
      trendText: '進步中'
    },
    {
      title: '睡眠',
      icon: Moon,
      value: `${healthData.sleep.value}`,
      unit: '小時',
      status: healthData.sleep.status,
      description: `質素 ${healthData.sleep.quality}%`,
      trend: 'stable',
      trendText: '良好'
    }
  ];

  const SkeletonLoader = () => (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-2xl mr-4 skeleton"></div>
              <div>
                <div className="h-6 w-20 bg-gray-200 rounded-lg mb-2 skeleton"></div>
                <div className="h-4 w-32 bg-gray-200 rounded-lg skeleton"></div>
              </div>
            </div>
          </div>
          <div className="h-8 w-24 bg-gray-200 rounded-lg mb-2 skeleton"></div>
          <div className="h-4 w-40 bg-gray-200 rounded-lg skeleton"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* 头部 - 精致设计 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <IconButton
              icon="ArrowLeft"
              onClick={() => navigate('/home')}
              variant="ghost"
              shape="rounded"
              size="md"
              tooltip="返回主頁"
              className="mr-4 bg-white/80 hover:bg-white border border-blue-200 text-blue-600 shadow-md hover:shadow-lg"
              aria-label="返回主頁"
            />
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">健康儀表板</h1>
              <p className="text-xl text-gray-600">關注您的健康，守護每一天</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-gray-500 mb-2">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">最後更新</span>
            </div>
            <p className="text-lg font-medium text-gray-700">
              {lastUpdated.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* 鼓励语卡片 */}
        {encouragement && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-200 mb-6">
            <div className="flex items-center">
              <Sparkles className="w-6 h-6 text-emerald-500 mr-3" />
              <p className="text-lg font-medium text-emerald-800">{encouragement}</p>
            </div>
          </div>
        )}
      </div>

      {/* 健康数据卡片 - 精致设计 */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {healthCards.map((card, index) => {
          const IconComponent = card.icon;
          const statusColor = getStatusColor(card.status);
          
          return (
            <div 
              key={index} 
              className={`${statusColor.bg} ${statusColor.border} border-2 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer group`}
              onClick={() => speak(`${card.title}：${card.value} ${card.unit}，${card.description}`)}
              role="button"
              aria-label={`${card.title} ${card.value} ${card.unit} ${card.description}`}
              tabIndex={0}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={`w-14 h-14 ${statusColor.bg} rounded-2xl flex items-center justify-center mr-4 border-2 ${statusColor.border} group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-7 h-7 ${statusColor.icon}`} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${statusColor.text}`}>{card.title}</h3>
                    <p className={`text-sm ${statusColor.text} opacity-75`}>{card.description}</p>
                  </div>
                </div>
                
                {/* 趋势指示器 */}
                <div className="flex items-center space-x-2">
                  {card.trend === 'up' && <TrendingUp className="w-5 h-5 text-emerald-500" />}
                  {card.trend === 'stable' && <div className="w-3 h-3 bg-gray-400 rounded-full" />}
                  <span className={`text-sm font-medium ${statusColor.text}`}>{card.trendText}</span>
                </div>
              </div>
              
              {/* 数值显示 */}
              <div className="text-center mb-4">
                <div className="flex items-baseline justify-center">
                  <span className={`text-5xl font-bold ${statusColor.text}`}>{card.value}</span>
                  <span className={`text-xl ml-2 ${statusColor.text} opacity-75`}>{card.unit}</span>
                </div>
              </div>
              
              {/* 进度条（步数专用） */}
              {card.progress !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">進度</span>
                    <span className="text-sm font-medium text-gray-700">{card.progress}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${statusColor.accent} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${card.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* 状态指示器 */}
              <div className="flex justify-center">
                <div className={`w-4 h-4 rounded-full ${statusColor.accent} animate-subtle-pulse`}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 用药提醒 - 精致卡片 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 mb-8 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mr-4">
              <Pill className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-800">用藥提醒</h3>
              <p className="text-blue-600">按時服藥，保持健康</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-2xl ${
            healthData.medication.taken 
              ? 'bg-emerald-100 text-emerald-800' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            {healthData.medication.taken ? '✅ 已服用' : '⏰ 待服用'}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="text-lg font-medium text-blue-800">
                下次用藥：{healthData.medication.nextDose}
              </p>
              <p className="text-blue-600">{healthData.medication.timeLeft}</p>
            </div>
          </div>
          <button 
            onClick={() => speak(`下次用藥時間是${healthData.medication.nextDose}，還有${healthData.medication.timeLeft}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-6 py-3 flex items-center transition-all duration-200 hover:scale-105"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            語音提醒
          </button>
        </div>
      </div>

      {/* 趋势图区域 - 精致设计 */}
      <div className="bg-white rounded-3xl p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mr-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">健康趨勢</h3>
              <p className="text-gray-600">一週數據概覽</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {['今日', '本週', '本月'].map((period) => (
              <button
                key={period}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-2xl text-sm font-medium transition-all duration-200"
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-blue-200">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <p className="text-lg text-blue-600 font-medium">心率趨勢圖</p>
            <p className="text-sm text-blue-500 mt-1">點擊查看詳細分析</p>
          </div>
        </div>
      </div>

      {/* 生成报告按钮 - 精致设计 */}
      <button
        onClick={generateHealthReport}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-3xl p-6 flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group"
        aria-label="生成健康報告"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
            <span className="text-xl font-bold">生成報告中...</span>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Download className="w-6 h-6 mr-3 relative z-10" />
            <span className="text-xl font-bold relative z-10">生成健康報告</span>
          </>
        )}
      </button>

      {/* 健康建议 - 温暖卡片 */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 mt-8 border border-amber-200">
        <div className="flex items-center mb-4">
          <Award className="w-6 h-6 text-amber-600 mr-3" />
          <h3 className="text-xl font-bold text-amber-800">今日建議</h3>
        </div>
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <p className="text-amber-700">步數未達標，建議飯後散步15分鐘，欣賞社區風景</p>
          </li>
          <li className="flex items-start">
            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <p className="text-amber-700">血壓正常，繼續保持規律作息，記得開心每一天</p>
          </li>
          <li className="flex items-start">
            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <p className="text-amber-700">睡眠質素良好，今晚可提前半小時休息，聽聽輕音樂</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ElegantHealthDashboard;