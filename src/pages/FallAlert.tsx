import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Phone } from 'lucide-react';
import { useAccessibility } from '../components/AccessibilitySettings';

const FallAlert: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useAccessibility();
  const [countdown, setCountdown] = useState(5);
  const [status, setStatus] = useState<'counting' | 'calling'>('counting');

  useEffect(() => {
    speak('Fall detected, emergency alert activated');
    setCountdown(5);
    setStatus('counting');
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('calling');
          speak('Calling emergency services');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [speak]);

  const handleCancel = () => {
    speak('Emergency alert cancelled');
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-red-600 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      {status === 'counting' ? (
        <>
          <h2 className="text-white text-3xl font-bold mb-2">Sending Emergency Alert</h2>
          <p className="text-red-100 text-xl mb-8">To family and emergency services</p>
          
          <div className="w-48 h-48 rounded-full border-8 border-white/30 flex items-center justify-center mb-12 relative">
             <div className="absolute inset-0 rounded-full border-8 border-white animate-[spin_5s_linear_reverse]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 50% 50%)'}}></div>
             <span className="text-8xl font-bold text-white">{countdown}</span>
          </div>

          <button 
            onClick={handleCancel}
            className="bg-white text-red-600 px-12 py-6 rounded-full text-2xl font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-3"
          >
            <X className="w-8 h-8" />
            CANCEL ALERT
          </button>
        </>
      ) : (
        <>
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <Phone className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-white text-4xl font-bold mb-4">Calling Help...</h2>
          <p className="text-red-100 text-xl mb-12">Daughter (Sarah) notified.<br/>Connecting to 24/7 Center.</p>
          <button 
            onClick={handleCancel}
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold"
          >
            End Call
          </button>
        </>
      )}
    </div>
  );
};

export default FallAlert;