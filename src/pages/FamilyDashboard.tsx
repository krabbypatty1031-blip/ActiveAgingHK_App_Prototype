import React, { useState, useEffect } from 'react';
import { Heart, Activity, Footprints, Moon, AlertTriangle, MapPin, Phone, Calendar, TrendingUp, User, Clock, Shield, MessageCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../components/ui/Button';

interface ElderlyUser {
  id: string;
  name: string;
  age: number;
  avatar: string;
  status: 'online' | 'offline' | 'warning';
  lastActive: string;
  location: string;
}

interface HealthData {
  heartRate: { value: number; status: 'good' | 'warning' | 'danger'; trend: 'up' | 'down' | 'stable' };
  bloodPressure: { systolic: number; diastolic: number; status: 'good' | 'warning' | 'danger' };
  steps: { value: number; goal: number; status: 'good' | 'warning' | 'danger' };
  sleep: { value: number; quality: number; status: 'good' | 'warning' | 'danger' };
  medication: { taken: boolean; nextDose: string };
}

interface Alert {
  id: string;
  type: 'emergency' | 'health' | 'activity';
  message: string;
  timestamp: string;
  userId: string;
  resolved: boolean;
}

const FamilyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<string>('1');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');
  
  const [elderlyUsers] = useState<ElderlyUser[]>([
    {
      id: '1',
      name: '陳太 (母親)',
      age: 78,
      avatar: '👵',
      status: 'online',
      lastActive: '2分鐘前',
      location: '九龍城區'
    },
    {
      id: '2',
      name: '李伯 (父親)',
      age: 82,
      avatar: '👴',
      status: 'warning',
      lastActive: '1小時前',
      location: '九龍城區'
    }
  ]);

  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: { value: 72, status: 'good', trend: 'stable' },
    bloodPressure: { systolic: 125, diastolic: 82, status: 'good' },
    steps: { value: 5800, goal: 8000, status: 'warning' },
    sleep: { value: 7.2, quality: 85, status: 'good' },
    medication: { taken: true, nextDose: '14:00' }
  });

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'emergency',
      message: '陳太觸發了SOS緊急求助',
      timestamp: '10:30',
      userId: '1',
      resolved: false
    },
    {
      id: '2',
      type: 'health',
      message: '李伯的步數未達標（僅2,100步）',
      timestamp: '18:00',
      userId: '2',
      resolved: false
    },
    {
      id: '3',
      type: 'activity',
      message: '陳太報名參加了明天的太極班',
      timestamp: '09:15',
      userId: '1',
      resolved: true
    }
  ]);

  const currentUser = elderlyUsers.find(user => user.id === selectedUser);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'danger': return 'text-red-600 bg-red-100';
      case 'online': return 'text-green-600';
      case 'offline': return 'text-gray-600';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'emergency': return '🚨';
      case 'health': return '💊';
      case 'activity': return '📅';
      default: return '🔔';
    }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const callUser = (user: ElderlyUser) => {
    alert(`正在撥打 ${user.name} 的電話...`);
  };

  const sendMessage = (user: ElderlyUser) => {
    alert(`正在打開與 ${user.name} 的訊息界面...`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 头部 */}
      <div className="flex items-center mb-8">
        <IconButton
          icon="ArrowLeft"
          onClick={() => navigate('/home')}
          variant="ghost"
          shape="rounded"
          size="md"
          tooltip="返回主頁"
          className="mr-4 bg-white/80 hover:bg-white border border-purple-200 text-purple-600 shadow-md hover:shadow-lg"
          aria-label="返回主頁"
        />
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">家屬照護儀表板</h1>
          <p className="text-xl text-gray-600">關心長者，守護健康</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：用户选择和概览 */}
        <div className="lg:col-span-1">
          {/* 用户选择 */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">選擇長者</h2>
            <div className="space-y-3">
              {elderlyUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedUser === user.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{user.avatar}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.age}歲</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`w-3 h-3 rounded-full mb-1 ${
                        user.status === 'online' ? 'bg-green-500' :
                        user.status === 'warning' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></div>
                      <p className="text-xs text-gray-500">{user.lastActive}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 快速操作 */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">快速操作</h2>
            <div className="space-y-3">
              <button
                onClick={() => callUser(currentUser!)}
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl p-3 flex items-center justify-center transform transition-all duration-200 hover:scale-105"
              >
                <Phone className="w-5 h-5 mr-2" />
                <span>撥打電話</span>
              </button>
              <button
                onClick={() => sendMessage(currentUser!)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-3 flex items-center justify-center transform transition-all duration-200 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                <span>發送訊息</span>
              </button>
              <button
                onClick={() => alert('查看位置功能')}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl p-3 flex items-center justify-center transform transition-all duration-200 hover:scale-105"
              >
                <MapPin className="w-5 h-5 mr-2" />
                <span>查看位置</span>
              </button>
            </div>
          </div>

          {/* 最近提醒 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">最近提醒</h2>
            <div className="space-y-3">
              {alerts.filter(alert => !alert.resolved).slice(0, 3).map((alert) => (
                <div key={alert.id} className="p-3 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <span className="text-xl mr-2">{getAlertIcon(alert.type)}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="text-green-600 hover:text-green-700 text-sm"
                    >
                      標記已讀
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：详细数据 */}
        <div className="lg:col-span-2">
          {/* 时间范围选择 */}
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg">
            <div className="flex space-x-4">
              {[{value: 'today', label: '今日'}, {value: 'week', label: '本週'}, {value: 'month', label: '本月'}].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value as any)}
                  className={`px-6 py-2 rounded-xl transition-all duration-200 ${
                    timeRange === range.value
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* 健康数据概览 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { title: '心率', value: `${healthData.heartRate.value} bpm`, icon: Heart, color: getStatusColor(healthData.heartRate.status) },
              { title: '血壓', value: `${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic}`, icon: Activity, color: getStatusColor(healthData.bloodPressure.status) },
              { title: '步數', value: `${healthData.steps.value}`, icon: Footprints, color: getStatusColor(healthData.steps.status) },
              { title: '睡眠', value: `${healthData.sleep.value}h`, icon: Moon, color: getStatusColor(healthData.sleep.status) }
            ].map((item, index) => (
              <div key={index} className={`${item.color} rounded-2xl p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <item.icon className="w-6 h-6" />
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>

          {/* 用药提醒 */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">用藥情況</h2>
              <div className={`px-4 py-2 rounded-xl ${
                healthData.medication.taken ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {healthData.medication.taken ? '已服用' : '未服用'}
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-600 mr-2" />
              <p className="text-lg text-gray-700">
                下次用藥時間：{healthData.medication.nextDose}
              </p>
            </div>
          </div>

          {/* 活动趋势 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">活動趨勢</h2>
              <div className="flex space-x-2">
                {['步數', '睡眠', '心率'].map((metric) => (
                  <button
                    key={metric}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm transition-all duration-200"
                  >
                    {metric}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-lg text-gray-500">活動趨勢圖表</p>
                <p className="text-sm text-gray-400 mt-1">顯示{timeRange === 'today' ? '今日' : timeRange === 'week' ? '本週' : '本月'}數據</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyDashboard;