import React, { useState } from 'react';
import { Camera, Video, Calendar, MapPin, Heart, MessageCircle, Phone, Users, Clock, Volume2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../components/ui/Button';

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  avatar: string;
  isOnline: boolean;
}

interface Photo {
  id: string;
  url: string;
  description: string;
  author: string;
  date: string;
  voiceDescription?: string;
}

interface Activity {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'exercise' | 'social' | 'health';
  registered: boolean;
}

const SocialFamily: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'album' | 'activities' | 'calls'>('album');
  
  const [familyMembers] = useState<FamilyMember[]>([
    { id: '1', name: '女兒 小玲', relation: '女兒', avatar: '👩‍💼', isOnline: true },
    { id: '2', name: '兒子 大明', relation: '兒子', avatar: '👨‍💻', isOnline: false },
    { id: '3', name: '媳婦 阿美', relation: '媳婦', avatar: '👩‍⚕️', isOnline: true },
    { id: '4', name: '孫仔 小寶', relation: '孫子', avatar: '👶', isOnline: true }
  ]);

  const [photos] = useState<Photo[]>([
    {
      id: '1',
      url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=happy%20asian%20family%20gathering%20in%20hong%20kong%20living%20room%2C%20elderly%20grandmother%20with%20grandchildren%2C%20warm%20lighting%2C%20celebration%20atmosphere&image_size=square',
      description: '孫仔學校表演啦！佢哋班表演咗粵劇，好精彩呀！',
      author: '女兒 小玲',
      date: '2024-01-15',
      voiceDescription: '孫仔學校表演啦！佢哋班表演咗粵劇，好精彩呀！'
    },
    {
      id: '2',
      url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20chinese%20family%20dinner%20in%20hong%20kong%2C%20elderly%20woman%20serving%20food%2C%20steaming%20hot%20pot%2C%20happy%20family%20atmosphere%2C%20warm%20lighting&image_size=square',
      description: '今晚打邊爐，一家人好開心！',
      author: '媳婦 阿美',
      date: '2024-01-10',
      voiceDescription: '今晚打邊爐，一家人好開心！'
    },
    {
      id: '3',
      url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=elderly%20chinese%20woman%20in%20hong%20kong%20park%2C%20morning%20tai%20chi%20practice%2C%20peaceful%20expression%2C%20beautiful%20sunrise%2C%20serene%20atmosphere&image_size=square',
      description: '媽咪晨運好精神！',
      author: '兒子 大明',
      date: '2024-01-08',
      voiceDescription: '媽咪晨運好精神！'
    }
  ]);

  const [activities] = useState<Activity[]>([
    {
      id: '1',
      title: '長者太極班',
      date: '2024-01-20',
      time: '09:00-10:30',
      location: '九龍城體育館',
      type: 'exercise',
      registered: false
    },
    {
      id: '2',
      title: '健康講座：血壓管理',
      date: '2024-01-22',
      time: '14:00-15:30',
      location: '社區中心',
      type: 'health',
      registered: true
    },
    {
      id: '3',
      title: '粵曲欣賞會',
      date: '2024-01-25',
      time: '19:30-21:00',
      location: '文化中心',
      type: 'social',
      registered: false
    },
    {
      id: '4',
      title: '書法興趣班',
      date: '2024-01-28',
      time: '10:00-11:30',
      location: '長者中心',
      type: 'social',
      registered: false
    }
  ]);

  const playVoiceDescription = (photo: Photo) => {
    if ('speechSynthesis' in window && photo.voiceDescription) {
      const utterance = new SpeechSynthesisUtterance(photo.voiceDescription);
      utterance.lang = 'zh-HK';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVideoCall = (member: FamilyMember) => {
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    alert(`正在連接 ${member.name} 的視頻通話...`);
  };

  const makePhoneCall = (member: FamilyMember) => {
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    alert(`正在撥打 ${member.name}：+852 9123 4567`);
  };

  const registerActivity = (activityId: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(150);
    }
    alert('活動報名成功！我會提醒您準時參加。');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exercise': return '🏃‍♀️';
      case 'health': return '💊';
      case 'social': return '🎭';
      default: return '📅';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      {/* 头部 */}
      <div className="flex items-center justify-center mb-8 relative">
        <IconButton
          icon="ArrowLeft"
          onClick={() => navigate('/home')}
          variant="ghost"
          shape="rounded"
          size="md"
          tooltip="返回主頁"
          className="absolute left-0 bg-white/80 hover:bg-white border border-purple-200 text-purple-600 shadow-md hover:shadow-lg"
          aria-label="返回主頁"
        />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">家人與社交</h1>
          <p className="text-xl text-gray-600">與家人保持聯繫，參與社區活動</p>
        </div>
      </div>

      {/* 标签导航 */}
      <div className="flex bg-white rounded-3xl p-2 mb-6">
        <button
          onClick={() => setActiveTab('album')}
          className={`flex-1 py-4 px-6 rounded-2xl text-xl font-semibold transition-all duration-200 ${
            activeTab === 'album'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          📸 家庭相冊
        </button>
        <button
          onClick={() => setActiveTab('activities')}
          className={`flex-1 py-4 px-6 rounded-2xl text-xl font-semibold transition-all duration-200 ${
            activeTab === 'activities'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          🎪 社區活動
        </button>
        <button
          onClick={() => setActiveTab('calls')}
          className={`flex-1 py-4 px-6 rounded-2xl text-xl font-semibold transition-all duration-200 ${
            activeTab === 'calls'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          📞 視頻通話
        </button>
      </div>

      {/* 家庭相册 */}
      {activeTab === 'album' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">家庭相冊</h2>
          <div className="space-y-4">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-white rounded-3xl p-6 shadow-lg">
                <div className="mb-4">
                  <img
                    src={photo.url}
                    alt={photo.description}
                    className="w-full h-48 object-cover rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJhzwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </div>
                
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-xl font-semibold text-gray-800 mb-2">
                      {photo.description}
                    </p>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-base mr-4">{photo.author}</span>
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-base">{photo.date}</span>
                    </div>
                  </div>
                </div>
                
                {photo.voiceDescription && (
                  <button
                    onClick={() => playVoiceDescription(photo)}
                    className="bg-pink-500 hover:bg-pink-600 text-white rounded-2xl px-6 py-3 flex items-center transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Volume2 className="w-5 h-5 mr-2" />
                    <span className="text-lg font-semibold">播放語音說明</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 社区活动 */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">社區活動</h2>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-3xl p-6 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{getActivityIcon(activity.type)}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {activity.title}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-base">{activity.date} {activity.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-base">{activity.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {activity.registered ? (
                  <div className="bg-green-100 text-green-800 rounded-2xl px-6 py-3 text-center">
                    <span className="text-lg font-semibold">✅ 已報名</span>
                  </div>
                ) : (
                  <button
                    onClick={() => registerActivity(activity.id)}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-2xl px-6 py-3 text-lg font-semibold transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    立即報名
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 视频通话 */}
      {activeTab === 'calls' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">家人視頻</h2>
          <div className="grid grid-cols-2 gap-4">
            {familyMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-3xl p-6 shadow-lg text-center">
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-base text-gray-600 mb-4">{member.relation}</p>
                
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    member.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <span className={`text-sm ${
                    member.isOnline ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {member.isOnline ? '在線' : '離線'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => startVideoCall(member)}
                    disabled={!member.isOnline}
                    className={`w-full rounded-2xl p-3 flex items-center justify-center transform transition-all duration-200 ${
                      member.isOnline
                        ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 active:scale-95'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Video className="w-5 h-5 mr-2" />
                    <span className="text-lg font-semibold">視頻通話</span>
                  </button>
                  
                  <button
                    onClick={() => makePhoneCall(member)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl p-3 flex items-center justify-center transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    <span className="text-lg font-semibold">語音通話</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialFamily;