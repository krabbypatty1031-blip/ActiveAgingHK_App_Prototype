import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Heart,
  MessageCircle,
  Share2,
  ShieldCheck
} from 'lucide-react';
import { useAccessibility } from '../components/AccessibilitySettings';
import { IconButton } from '../components/ui/Button';

interface Contact {
  name: string;
  phone: string;
  type: 'family' | 'medical' | 'emergency';
  avatar?: string;
  relation: string;
}

const ElegantEmergencySystem: React.FC = () => {
  const { speak } = useAccessibility();
  const navigate = useNavigate();
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [fallDetected, setFallDetected] = useState(false);
  const [emergencyContacts] = useState<Contact[]>([
    { name: 'Daughter Ling Chan', phone: '9123 4567', type: 'family', avatar: '👩‍💼', relation: 'Daughter' },
    { name: 'Son Ming Chan', phone: '9234 5678', type: 'family', avatar: '👨‍💻', relation: 'Son' },
    { name: '24-Hour Support Center', phone: '2382 0000', type: 'emergency', avatar: '🚨', relation: 'Professional Support' },
    { name: 'Family Doctor Dr. Wong', phone: '2525 2525', type: 'medical', avatar: '👨‍⚕️', relation: 'Primary Doctor' }
  ]);

  const [recentActivity] = useState([
    { time: '09:30', event: 'Morning Walk 30 minutes', status: 'good' },
    { time: '12:15', event: 'Lunch Time', status: 'good' },
    { time: '14:30', event: 'Medication Reminder', status: 'pending' }
  ]);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Unable to get location information');
        }
      );
    }

    // Simulate fall detection
    const fallDetectionTimer = setInterval(() => {
      if (Math.random() < 0.001 && !isEmergencyActive) {
        setFallDetected(true);
        startEmergencyCountdown();
      }
    }, 5000);

    return () => clearInterval(fallDetectionTimer);
  }, [isEmergencyActive]);

  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;
    
    if (isEmergencyActive && countdown > 0) {
      countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            sendEmergencyAlert();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [isEmergencyActive, countdown]);

  const startEmergencyCountdown = () => {
    setIsEmergencyActive(true);
    setCountdown(30);
    
    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500, 200, 500]);
    }
    
    speak('Possible fall detected, emergency alert will be sent automatically in 30 seconds');
  };

  const handleSOS = () => {
    startEmergencyCountdown();
    speak('Emergency help mode activated');
  };

  const cancelEmergency = () => {
    setIsEmergencyActive(false);
    setCountdown(30);
    setFallDetected(false);
    
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    
    speak('Emergency alert cancelled, please stay safe');
  };

  const sendEmergencyAlert = () => {
    setIsEmergencyActive(false);
    setCountdown(30);
    setFallDetected(false);
    
    const alertMessage = `
      🚨 Emergency Alert 🚨
      
      User: Mrs. Chan (85 years old)
      Location: Kowloon City, Hong Kong
      Time: ${new Date().toLocaleString('en-HK')}
      Status: ${fallDetected ? 'Fall Detected' : 'Manual Alert'}
      
      ✅ All emergency contacts have been notified!
      🚑 Rescue team is on the way
      📞 Please keep your phone available
      
      Please stay calm, we are with you ❤️
    `;
    
    speak('Alert signal sent, rescue team is arriving, please stay calm');
    alert(alertMessage);
    
    if (navigator.vibrate) {
      navigator.vibrate([1000, 500, 1000, 500, 1000]);
    }
  };

  const callContact = (contact: Contact) => {
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    
    speak(`Calling ${contact.name} for you`);
    alert(`Calling ${contact.name}: ${contact.phone}`);
  };

  const shareLocation = () => {
    const coords = location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'location pending';
    speak('Sharing your live location with family');
    alert(`Sharing current location: ${coords}`);
  };

  const sendCalmMessage = () => {
    speak('Sending a calm reassurance message to your family');
    alert('A gentle reassurance message was sent to your family chat.');
  };

  const quickActions = [
    {
      title: 'Call ambulance',
      detail: 'Connect with 999 hotline',
      accent: 'from-rose-500 to-red-600',
      Icon: AlertTriangle,
      action: handleSOS
    },
    {
      title: 'Share location',
      detail: 'Send GPS pin automatically',
      accent: 'from-indigo-500 to-blue-600',
      Icon: Share2,
      action: shareLocation
    },
    {
      title: 'Calming message',
      detail: 'Notify family you are safe',
      accent: 'from-emerald-500 to-teal-500',
      Icon: MessageCircle,
      action: sendCalmMessage
    }
  ];

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'family': return '👨‍👩‍👧‍👦';
      case 'medical': return '👨‍⚕️';
      case 'emergency': return '🚨';
      default: return '📞';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  /** handleBackToHome - Provide consistent return to home page experience in emergency scenarios */
  const handleBackToHome = () => {
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    speak('Back to home');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        <section className="rounded-[32px] bg-gradient-to-br from-rose-500 via-red-500 to-orange-500 text-white shadow-2xl p-6 sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <IconButton
                  icon="ArrowLeft"
                  onClick={handleBackToHome}
                  variant="ghost"
                  shape="rounded"
                  size="md"
                  className="bg-white/15 border border-white/30 hover:bg-white/25"
                  aria-label="Back to Home"
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/80">Emergency suite</p>
                  <h1 className="text-3xl font-bold mt-1">Safety Guardian</h1>
                  <p className="text-white/80 mt-2 max-w-2xl">
                    24-hour companionship that detects falls, shares your location, and keeps family within one tap.
                  </p>
                </div>
              </div>
              <div className="rounded-3xl bg-white/15 px-5 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-white/70">System status</p>
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5" />
                  <div>
                    <p className="text-base font-semibold">Normal monitoring</p>
                    <p className="text-xs text-white/70">Last check · Just now</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {quickActions.map((action) => {
                const ActionIcon = action.Icon;
                return (
                  <button
                    key={action.title}
                    onClick={action.action}
                    className={`rounded-3xl px-5 py-4 text-left bg-gradient-to-r ${action.accent} shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5`}
                  >
                    <ActionIcon className="w-6 h-6 text-white mb-3" />
                    <p className="text-lg font-semibold">{action.title}</p>
                    <p className="text-sm text-white/80">{action.detail}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
          <div className="space-y-6">
            <section className="rounded-3xl bg-white/90 p-6 shadow-xl border border-white/70">
              <div className="flex flex-col items-center text-center gap-6">
                <div className="relative inline-block">
                  {isEmergencyActive && <div className="absolute inset-0 bg-red-400/70 rounded-[32px] blur-2xl animate-ping" />}
                  <button
                    onClick={handleSOS}
                    disabled={isEmergencyActive}
                    className={`relative w-56 h-56 rounded-[32px] flex flex-col items-center justify-center shadow-2xl transition-all duration-300 text-white ${
                      isEmergencyActive
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 hover:scale-105 active:scale-95'
                    }`}
                    aria-label="Emergency Help Button"
                    aria-pressed={isEmergencyActive}
                    aria-live="polite"
                  >
                    <Phone className="w-16 h-16 mb-3" />
                    <span className="text-3xl font-bold">SOS</span>
                    <span className="text-base">Emergency help</span>
                    {!isEmergencyActive && <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-[32px]" />}
                  </button>
                </div>
                <p className="text-gray-600 text-lg">Press the button to get help immediately</p>
              </div>
            </section>

            {isEmergencyActive && (
              <section className="rounded-3xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-red-50 p-6 shadow-xl">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-red-500 rounded-2xl mb-4">
                    <AlertTriangle className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-red-800 mb-2">
                    {fallDetected ? 'Fall Detection Alert' : 'Emergency Alert Activated'}
                  </h2>
                  <p className="text-red-700">
                    {fallDetected ? 'We detected a possible fall. Confirm your safety or send alert now.' : 'Alert signal will send automatically unless cancelled.'}
                  </p>
                </div>
                <div className="text-center mb-6">
                  <p className="text-6xl font-bold text-red-600 font-mono">{countdown}</p>
                  <p className="text-red-700">seconds until automatic notification</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    onClick={cancelEmergency}
                    className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-4 flex items-center justify-center gap-2 hover:scale-[1.02] transition"
                  >
                    <CheckCircle className="w-6 h-6" /> I'm OK
                  </button>
                  <button
                    onClick={sendEmergencyAlert}
                    className="rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-4 flex items-center justify-center gap-2 hover:scale-[1.02] transition"
                  >
                    <Phone className="w-6 h-6" /> Send Now
                  </button>
                </div>
                <p className="text-center text-red-700 mt-4">🔔 Professional rescue team is standing by</p>
              </section>
            )}

            <section className="rounded-3xl bg-white/90 p-6 shadow-xl border border-white/70">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Auto geolocation</p>
                    <h2 className="text-xl font-semibold">Current location</h2>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">Live</span>
              </div>
              {location ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <div>
                      <p className="font-semibold text-blue-800">Kowloon City, Hong Kong</p>
                      <p className="text-xs text-blue-600">Accuracy high · sharing ready</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-gray-500">Latitude</p>
                      <p className="font-mono text-gray-800">{location.lat.toFixed(4)}°</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-gray-500">Longitude</p>
                      <p className="font-mono text-gray-800">{location.lng.toFixed(4)}°</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Locating your position...</div>
              )}
            </section>

            <section className="rounded-3xl bg-white/90 p-6 shadow-xl border border-white/70">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Safety record</p>
                  <h2 className="text-xl font-semibold">Today's activities</h2>
                </div>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className={`p-4 rounded-2xl border-2 ${getStatusColor(activity.status)}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{activity.event}</p>
                        <p className="text-sm text-gray-600">{activity.time}</p>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-white/60">
                        {activity.status === 'good' ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl bg-white/90 p-6 shadow-xl border border-white/70">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Trusted helpers</p>
                  <h2 className="text-xl font-semibold">Emergency contacts</h2>
                </div>
                <Heart className="w-5 h-5 text-rose-500" />
              </div>
              <div className="space-y-4">
                {emergencyContacts.map((contact) => (
                  <div key={contact.phone} className="p-4 rounded-2xl bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-xl">
                        {contact.avatar || getContactIcon(contact.type)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{contact.name}</p>
                        <p className="text-xs text-gray-500">{contact.relation}</p>
                        <p className="text-xs text-gray-400">{contact.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => callContact(contact)}
                      className="px-3 py-2 rounded-2xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-400 transition"
                    >
                      Call
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white/90 p-6 shadow-xl border border-white/70">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                <div>
                  <p className="text-sm text-gray-500">Peace of mind</p>
                  <h2 className="text-xl font-semibold">Comfort message</h2>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                You are never alone. The system keeps monitoring quietly and alerts your loved ones instantly. Take a deep breath—help is always within reach.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
                <Heart className="w-4 h-4" />
                Live support available 24/7
              </div>
            </section>

            <section className="rounded-3xl bg-white/90 p-6 shadow-xl border border-white/70 text-center">
              <p className="text-sm text-gray-500">Support mantra</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                “We stay beside you even when no one else is around.”
              </p>
            </section>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border border-blue-200">
            <Heart className="w-5 h-5 text-rose-500 mr-2" />
            <p className="text-blue-800 font-medium">You are not alone, we are always watching over you 💙</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElegantEmergencySystem;