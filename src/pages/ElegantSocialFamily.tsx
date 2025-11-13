import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Video, Calendar, MapPin, Heart, MessageCircle, Phone, Users, Clock, Sparkles, Send, Star, CheckCircle, Volume2 } from 'lucide-react';
import { useAccessibility } from '../components/AccessibilitySettings';
import { IconButton } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
  message?: string;
}

interface Photo {
  id: string;
  url: string;
  description: string;
  author: string;
  date: string;
  voiceDescription?: string;
  likes: number;
  isLiked: boolean;
}

interface Activity {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'exercise' | 'social' | 'health';
  registered: boolean;
  participants: number;
}

const ElegantSocialFamily: React.FC = () => {
  const { speak } = useAccessibility();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'album' | 'activities' | 'calls'>('album');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  
  const [familyMembers] = useState<FamilyMember[]>([
    { id: '1', name: '女兒 小玲', relation: '女兒', avatar: '👩‍💼', isOnline: true, lastSeen: '正在線上', message: '媽咪，記得食藥呀！❤️' },
    { id: '2', name: '兒子 大明', relation: '兒子', avatar: '👨‍💻', isOnline: false, lastSeen: '2小時前', message: '今日天氣好，適合散步' },
    { id: '3', name: '媳婦 阿美', relation: '媳婦', avatar: '👩‍⚕️', isOnline: true, lastSeen: '正在線上', message: '我買了您最鍾意的水果' },
    { id: '4', name: '孫仔 小寶', relation: '孫子', avatar: '👶', isOnline: true, lastSeen: '正在線上', message: '阿嫲，我今日好乖呀！' }
  ]);

  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: '1',
      url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=happy%20asian%20family%20gathering%20in%20cozy%20hong%20kong%20living%20room%2C%20warm%20lighting%2C%20elderly%20grandmother%20laughing%20with%20grandchildren%2C%20soft%20pastel%20colors%2C%20peaceful%20atmosphere&image_size=square',
      description: '孫仔學校表演啦！佢哋班表演咗粵劇，好精彩呀！我哋全家人都好開心，為佢感到驕傲。',
      author: '女兒 小玲',
      date: '2024-01-15',
      voiceDescription: '孫仔學校表演啦！佢哋班表演咗粵劇，好精彩呀！',
      likes: 8,
      isLiked: true
    },
    {
      id: '2',
      url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20chinese%20family%20hot%20pot%20dinner%2C%20warm%20golden%20lighting%2C%20elderly%20woman%20serving%20food%2C%20steaming%20hot%20pot%2C%20happy%20family%20laughter%2C%20cozy%20atmosphere%2C%20soft%20colors&image_size=square',
      description: '今晚打邊爐，一家人好開心！阿嫲煮咗好多好味嘢，我哋食得好飽，傾計傾到好夜。',
      author: '媳婦 阿美',
      date: '2024-01-10',
      voiceDescription: '今晚打邊爐，一家人好開心！',
      likes: 12,
      isLiked: false
    },
    {
      id: '3',
      url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=elderly%20chinese%20woman%20morning%20tai%20chi%20in%20hong%20kong%20park%2C%20soft%20sunrise%20light%2C%20peaceful%20expression%2C%20beautiful%20nature%2C%20serene%20atmosphere%2C%20gentle%20colors&image_size=square',
      description: '媽咪晨運好精神！每日都堅持做運動，身體越來越好，我哋好開心見到您咁健康。',
      author: '兒子 大明',
      date: '2024-01-08',
      voiceDescription: '媽咪晨運好精神！',
      likes: 15,
      isLiked: true
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
      registered: false,
      participants: 25
    },
    {
      id: '2',
      title: '健康講座：血壓管理',
      date: '2024-01-22',
      time: '14:00-15:30',
      location: '社區中心',
      type: 'health',
      registered: true,
      participants: 40
    },
    {
      id: '3',
      title: '粵曲欣賞會',
      date: '2024-01-25',
      time: '19:30-21:00',
      location: '文化中心',
      type: 'social',
      registered: false,
      participants: 60
    },
    {
      id: '4',
      title: '書法興趣班',
      date: '2024-01-28',
      time: '10:00-11:30',
      location: '長者中心',
      type: 'social',
      registered: false,
      participants: 15
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
    speak(`正在連接${member.name}的視頻通話`);
    alert(`正在連接 ${member.name} 的視頻通話...`);
  };

  const makePhoneCall = (member: FamilyMember) => {
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    speak(`正在撥打${member.name}的電話`);
    alert(`正在撥打 ${member.name}：+852 9123 4567`);
  };

  const registerActivity = (activityId: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(150);
    }
    speak('活動報名成功，我會提醒您準時參加');
    alert('活動報名成功！我會提醒您準時參加。期待您的參與！🎉');
  };

  const likePhoto = (photoId: string) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId 
        ? { ...photo, isLiked: !photo.isLiked, likes: photo.isLiked ? photo.likes - 1 : photo.likes + 1 }
        : photo
    ));
    
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exercise': return '🏃‍♀️';
      case 'health': return '💊';
      case 'social': return '🎭';
      default: return '📅';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'exercise': return 'from-green-100 to-emerald-100 border-green-200';
      case 'health': return 'from-blue-100 to-cyan-100 border-blue-200';
      case 'social': return 'from-purple-100 to-pink-100 border-purple-200';
      default: return 'from-gray-100 to-gray-200 border-gray-200';
    }
  };

  /** handleBackToHome - 引导长者快速返回主畫面并提供语音反馈 */
  const handleBackToHome = () => {
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    speak('返回主頁');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6">
      {/* 头部 - 温暖家庭氛围 */}
      <div className="mb-8">
        {/* 返回按钮 - 与助手页面保持一致的图标按钮体验 */}
        <div className="flex items-center justify-start mb-4">
          <IconButton
            icon="ArrowLeft"
            onClick={handleBackToHome}
            variant="ghost"
            shape="rounded"
            size="md"
            tooltip="返回主頁"
            className="bg-white/80 hover:bg-white border border-pink-200 text-pink-600 shadow-md hover:shadow-lg transition-all duration-200"
            aria-label="返回主頁"
          />
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-3xl mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">家人與社交</h1>
          <p className="text-xl text-gray-600">家人的愛，永遠在身邊</p>
        </div>

        {/* 今日温暖问候 */}
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-3xl p-6 border border-pink-200 mb-6">
          <div className="flex items-center mb-3">
            <Sparkles className="w-6 h-6 text-pink-500 mr-3" />
            <h3 className="text-xl font-bold text-pink-800">今日温暖</h3>
          </div>
          <p className="text-pink-700 text-lg">"家人的陪伴是最長情的告白，每一刻都值得珍惜。" 💕</p>
        </div>
      </div>

      {/* 标签导航 - 温暖设计 */}
      <div className="flex bg-white rounded-3xl p-3 mb-8 shadow-lg">
        {[
          { key: 'album', label: '📸 家庭相冊', desc: '美好回憶' },
          { key: 'activities', label: '🎪 社區活動', desc: '精彩生活' },
          { key: 'calls', label: '📞 視頻通話', desc: '親情連線' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 p-4 rounded-2xl transition-all duration-300 ${
              activeTab === tab.key
                ? 'bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-pink-50'
            }`}
          >
            <div className="text-center">
              <div className="text-lg mb-1">{tab.label.split(' ')[0]}</div>
              <div className="text-xs opacity-75">{tab.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* 家庭相册 - 温暖回忆 */}
      {activeTab === 'album' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">家庭相冊</h2>
            <div className="flex items-center text-sm text-gray-500">
              <Heart className="w-4 h-4 mr-1 text-rose-500" />
              <span>滿載回憶</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="mb-5">
                  <img
                    src={photo.url}
                    alt={photo.description}
                    className="w-full h-56 object-cover rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJhzwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </div>
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-800 mb-2 leading-relaxed">
                      {photo.description}
                    </p>
                    <div className="flex items-center text-gray-600 mb-3">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm mr-4">{photo.author}</span>
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{photo.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => likePhoto(photo.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all duration-200 ${
                        photo.isLiked 
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${photo.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{photo.likes}</span>
                    </button>
                    
                    {photo.voiceDescription && (
                      <button
                        onClick={() => playVoiceDescription(photo)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-2xl px-4 py-2 flex items-center space-x-2 transition-all duration-200"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span className="text-sm font-medium">播放語音</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center text-rose-500">
                    <Star className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">珍藏</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 社区活动 - 温暖参与 */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">社區活動</h2>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span>精彩生活</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className={`bg-gradient-to-r ${getActivityColor(activity.type)} rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">{getActivityIcon(activity.type)}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{activity.title}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">{activity.date} {activity.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{activity.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{activity.participants}人參加</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.registered 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-white text-gray-700'
                    }`}>
                      {activity.registered ? '已報名' : '可報名'}
                    </div>
                  </div>
                </div>
                
                {activity.registered ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-emerald-600">
                      <Icon name="CheckCircle" size="md" color="success" className="mr-2" />
                      <span className="font-medium">期待您的參與！</span>
                    </div>
                    <div className="bg-emerald-500 text-white rounded-2xl px-6 py-2">
                      <span className="font-medium">已報名 ✓</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => registerActivity(activity.id)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-3xl p-4 flex items-center justify-center transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    <span className="font-bold">立即報名參加</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 视频通话 - 亲情连线 */}
      {activeTab === 'calls' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">家人視頻</h2>
            <div className="flex items-center text-sm text-gray-500">
              <Heart className="w-4 h-4 mr-1 text-emerald-500" />
              <span>親情連線</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {familyMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-4xl mr-4">{member.avatar}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                      <p className="text-gray-600">{member.relation}</p>
                      <div className="flex items-center mt-1">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          member.isOnline ? 'bg-emerald-500' : 'bg-gray-400'
                        }`}></div>
                        <span className={`text-sm ${
                          member.isOnline ? 'text-emerald-600' : 'text-gray-500'
                        }`}>
                          {member.isOnline ? '正在線上' : member.lastSeen}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {member.isOnline && (
                      <div className="bg-emerald-100 text-emerald-800 rounded-full px-3 py-1 mb-3">
                        <span className="text-sm font-medium">可通話</span>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <button
                        onClick={() => startVideoCall(member)}
                        disabled={!member.isOnline}
                        className={`w-full rounded-2xl p-3 flex items-center justify-center transition-all duration-200 ${
                          member.isOnline
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:scale-105'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Video className="w-5 h-5 mr-2" />
                        <span className="font-medium">視頻通話</span>
                      </button>
                      
                      <button
                        onClick={() => makePhoneCall(member)}
                        className="w-full bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-2xl p-3 flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        <Phone className="w-5 h-5 mr-2" />
                        <span className="font-medium">語音通話</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {member.message && (
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-200">
                    <div className="flex items-start">
                      <MessageCircle className="w-5 h-5 text-pink-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-pink-800 font-medium mb-1">{member.message}</p>
                        <p className="text-pink-600 text-sm">剛剛</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 底部温暖提示 */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl border border-rose-200">
          <Heart className="w-6 h-6 text-rose-500 mr-3" />
          <p className="text-rose-800 font-medium text-lg">無論幾遠，家人永遠是最溫暖嘅港灣 💕</p>
        </div>
      </div>
    </div>
  );
};

export default ElegantSocialFamily;