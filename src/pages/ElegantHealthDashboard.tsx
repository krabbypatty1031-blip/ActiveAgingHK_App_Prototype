import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Activity, Footprints, Moon, Download, TrendingUp, Award, Calendar, Clock, Sparkles, Pill, Volume2, ArrowLeft, BatteryCharging, Droplet, Syringe, AlertCircle, XCircle, Bot, ShieldCheck, Phone } from 'lucide-react';
import { useAccessibility } from '../components/AccessibilitySettings';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../components/ui/Button';
import useAIStore from '../store/ai'
import { formatHealthSummary } from '../lib/aiFormat'
import { useThemedClass } from '../hooks/useThemedClass';

interface HealthData {
  heartRate: { value: number; status: 'good' | 'warning' | 'danger'; trend: 'up' | 'down' | 'stable' };
  bloodPressure: { systolic: number; diastolic: number; status: 'good' | 'warning' | 'danger' };
  steps: { value: number; goal: number; status: 'good' | 'warning' | 'danger'; progress: number };
  sleep: { value: number; quality: number; status: 'good' | 'warning' | 'danger' };
  medication: { taken: boolean; nextDose: string; timeLeft: string };
}

const ElegantHealthDashboard: React.FC = () => {
  const { speak } = useAccessibility();
  const navigate = useNavigate();
  const { advice, updatedAt, clearAdvice, source } = useAIStore();
  const { themed } = useThemedClass();
  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: { value: 72, status: 'good', trend: 'stable' },
    bloodPressure: { systolic: 125, diastolic: 82, status: 'good' },
    steps: { value: 6800, goal: 8000, status: 'warning', progress: 85 },
    sleep: { value: 7.2, quality: 85, status: 'good' },
    medication: { taken: true, nextDose: '14:00', timeLeft: 'in 2 hours' }
  });

  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [encouragement, setEncouragement] = useState('');
  const [aedBattery, setAedBattery] = useState(78);
  const [cholesterol, setCholesterol] = useState({ total: 175, ldl: 120, hdl: 55 });
  const [recordModal, setRecordModal] = useState<'vaccine' | 'allergy' | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Generate encouragement based on overall health status.
    const encouragements = {
      good: [
        'You are in great shape today! Keep it up 💚',
        'Wonderful performance today! Proud of you ✨',
        'All indicators are steady—life feels better 🌸',
        'Your persistence is paying off! Stay motivated 💪'
      ],
      warning: [
        'Take a little extra care and you will feel even better 💛',
        'Quick reminder: moving more is great for your body 🚶‍♀️',
        'Today was good; tomorrow will be even better! 🌟',
        'Take it slow—health is a marathon 🏃‍♀️'
      ],
      danger: [
        'Please rest and prioritise your wellbeing ❤️',
        'If you feel unwell, remember to reach out to family 📞',
        'Health comes first; everything else can wait 💝',
        'Take a deep breath and relax 🧘‍♀️'
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
        bg: themed('bg-emerald-50', 'bg-emerald-900/30'),
        text: themed('text-emerald-700', 'text-emerald-200'),
        border: themed('border-emerald-200', 'border-emerald-600'),
        accent: themed('bg-emerald-500', 'bg-emerald-400'),
        icon: themed('text-emerald-600', 'text-emerald-300'),
        track: themed('bg-gray-200', 'bg-slate-700'),
        trackText: themed('text-gray-600', 'text-gray-300'),
        trackValue: themed('text-gray-700', 'text-gray-200')
      };
      case 'warning': return {
        bg: themed('bg-amber-50', 'bg-amber-900/30'),
        text: themed('text-amber-700', 'text-amber-200'),
        border: themed('border-amber-200', 'border-amber-600'),
        accent: themed('bg-amber-500', 'bg-amber-400'),
        icon: themed('text-amber-600', 'text-amber-300'),
        track: themed('bg-gray-200', 'bg-slate-700'),
        trackText: themed('text-gray-600', 'text-gray-300'),
        trackValue: themed('text-gray-700', 'text-gray-200')
      };
      case 'danger': return {
        bg: themed('bg-rose-50', 'bg-rose-900/30'),
        text: themed('text-rose-700', 'text-rose-200'),
        border: themed('border-rose-200', 'border-rose-600'),
        accent: themed('bg-rose-500', 'bg-rose-400'),
        icon: themed('text-rose-600', 'text-rose-300'),
        track: themed('bg-gray-200', 'bg-slate-700'),
        trackText: themed('text-gray-600', 'text-gray-300'),
        trackValue: themed('text-gray-700', 'text-gray-200')
      };
      default: return {
        bg: themed('bg-gray-50', 'bg-slate-900/30'),
        text: themed('text-gray-700', 'text-gray-200'),
        border: themed('border-gray-200', 'border-slate-700'),
        accent: themed('bg-gray-500', 'bg-slate-500'),
        icon: themed('text-gray-600', 'text-gray-300'),
        track: themed('bg-gray-200', 'bg-slate-700'),
        trackText: themed('text-gray-600', 'text-gray-300'),
        trackValue: themed('text-gray-700', 'text-gray-200')
      };
    }
  };

  const generateHealthReport = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const report = `
        🏥 Health Report - ${new Date().toLocaleDateString('en-HK')}
        
        ❤️ Heart rate: ${healthData.heartRate.value} bpm (${getStatusText(healthData.heartRate.status)})
        🩺 Blood pressure: ${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic} mmHg (${getStatusText(healthData.bloodPressure.status)})
        👟 Steps: ${healthData.steps.value}/${healthData.steps.goal} (${getStatusText(healthData.steps.status)})
        😴 Sleep: ${healthData.sleep.value} hours, quality ${healthData.sleep.quality}% (${getStatusText(healthData.sleep.status)})
        💊 Medication: ${healthData.medication.taken ? 'Taken on time' : 'Pending'}
        
        📊 Overall summary: ${encouragement}
      `;
      
      speak('Health report generated successfully');
      alert(report);
      setIsLoading(false);
    }, 1500);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good': return 'Normal';
      case 'warning': return 'Watch';
      case 'danger': return 'Alert';
      default: return 'Unknown';
    }
  };

  const healthCards = [
    {
      title: 'Heart rate',
      icon: Heart,
      value: `${healthData.heartRate.value}`,
      unit: 'bpm',
      status: healthData.heartRate.status,
      description: 'Heartbeat is steady',
      trend: healthData.heartRate.trend,
      trendText: 'Stable'
    },
    {
      title: 'Blood pressure',
      icon: Activity,
      value: `${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic}`,
      unit: 'mmHg',
      status: healthData.bloodPressure.status,
      description: 'Pressure is steady',
      trend: 'stable',
      trendText: 'Normal'
    },
    {
      title: 'Steps',
      icon: Footprints,
      value: `${healthData.steps.value}`,
      unit: 'steps',
      status: healthData.steps.status,
      description: `Goal ${healthData.steps.goal} steps`,
      progress: healthData.steps.progress,
      trend: 'up',
      trendText: 'Improving'
    },
    {
      title: 'Sleep',
      icon: Moon,
      value: `${healthData.sleep.value}`,
      unit: 'hours',
      status: healthData.sleep.status,
      description: `Quality ${healthData.sleep.quality}%`,
      trend: 'stable',
      trendText: 'Good'
    }
  ];

  const openVaccinationRecords = () => {
    setRecordModal('vaccine');
    speak('Opening vaccination records');
  };

  const openAllergyRecords = () => {
    setRecordModal('allergy');
    speak('Opening allergy records');
  };

  const openAIInsight = () => {
    const payload = formatHealthSummary(
      healthData,
      aedBattery,
      cholesterol,
      lastUpdated.toISOString()
    );
    speak('Generating AI insights, switching to assistant');
    navigate('/assistant', { state: { aiInput: payload } });
  };

  const overallStatus = useMemo(() => getOverallStatus(), [healthData]);

  const readinessScore = useMemo(() => {
    const base = (healthData.steps.progress + healthData.sleep.quality + (healthData.medication.taken ? 95 : 70)) / 3;
    return Math.min(100, Math.round(base));
  }, [healthData]);

  const highlightStats = useMemo(() => [
    { label: 'Heart rate', value: `${healthData.heartRate.value} bpm`, detail: getStatusText(healthData.heartRate.status) },
    { label: 'Steps', value: `${healthData.steps.value}/${healthData.steps.goal}`, detail: `${healthData.steps.progress}% today` },
    { label: 'Sleep', value: `${healthData.sleep.value} hrs`, detail: `Quality ${healthData.sleep.quality}%` }
  ], [healthData]);

  const careTimeline = useMemo(() => [
    { time: '08:15', title: 'Morning walk', detail: 'Completed 1.2 km slow walk', accent: 'from-emerald-500 to-teal-500' },
    { time: '12:30', title: 'Hydration reminder', detail: 'Finished 300ml warm water', accent: 'from-blue-500 to-cyan-500' },
    { time: '15:00', title: 'Medication', detail: `Next dose in ${healthData.medication.timeLeft}`, accent: 'from-amber-500 to-orange-500' }
  ], [healthData.medication.timeLeft]);

  const quickActionCards = [
    {
      title: 'Vaccination records',
      description: 'Track boosters & appointments',
      gradient: 'from-teal-500 to-emerald-600',
      onClick: openVaccinationRecords,
      Icon: Syringe
    },
    {
      title: 'Allergy records',
      description: 'Stay aware of sensitivities',
      gradient: 'from-amber-500 to-orange-600',
      onClick: openAllergyRecords,
      Icon: AlertCircle
    },
    {
      title: 'AI insight',
      description: 'Let the assistant analyse',
      gradient: 'from-indigo-500 to-blue-600',
      onClick: openAIInsight,
      Icon: Bot
    }
  ];

  const careTips = [
    { title: 'Hydration check', detail: 'Sip a cup of warm water after medication.', Icon: Droplet },
    { title: 'Protect joints', detail: 'Stretch wrists and ankles for 2 minutes.', Icon: ShieldCheck },
    { title: 'Call for support', detail: 'Family hotline is ready if you feel unwell.', Icon: Phone }
  ];

  const supportContacts = [
    { name: 'Daughter Anna', relation: 'Family caregiver', status: 'Online now · can respond quickly.' },
    { name: 'Nurse Lam', relation: 'Community nurse', status: 'Weekday coverage · replies < 30 min.' }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${themed('bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800', 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-gray-100')}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        <section className="rounded-[32px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl p-6 sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <IconButton
                  icon="ArrowLeft"
                  onClick={() => navigate('/home')}
                  variant="ghost"
                  shape="rounded"
                  size="md"
                  className="bg-white/15 border border-white/30 hover:bg-white/25"
                  aria-label="Back to home"
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/70">Wellness overview</p>
                  <h1 className="text-3xl font-bold mt-1">Health dashboard</h1>
                  <p className="text-white/80 mt-2 max-w-2xl">
                    Stay mindful of your body with friendly coaching, proactive alerts, and one-tap access to your care resources.
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-white/70">
                    <Clock className="w-4 h-4" />
                    Updated {lastUpdated.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {highlightStats.map((chip) => (
                  <div key={chip.label} className="min-w-[150px] rounded-2xl bg-white/15 px-4 py-3 backdrop-blur shadow-inner">
                    <p className="text-xs uppercase tracking-wide text-white/60">{chip.label}</p>
                    <p className="text-lg font-semibold">{chip.value}</p>
                    <p className="text-xs text-white/70">{chip.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {advice && (
              <div className="bg-white/10 rounded-3xl p-5 border border-white/20">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5" />
                    <p className="text-sm font-semibold tracking-wide uppercase">AI tip of the day</p>
                  </div>
                  <button
                    onClick={() => clearAdvice()}
                    className="text-xs px-3 py-1 rounded-2xl bg-white/20 hover:bg-white/30 transition"
                  >
                    Clear
                  </button>
                </div>
                <p className="whitespace-pre-wrap text-base leading-relaxed text-white/90">{advice}</p>
                {updatedAt && (
                  <p className="text-xs text-white/70 mt-3">
                    Updated at {new Date(updatedAt).toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' })} · Source: {source || 'local'}
                  </p>
                )}
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              {quickActionCards.map((action) => {
                const ActionIcon = action.Icon;
                return (
                  <button
                    key={action.title}
                    onClick={action.onClick}
                    className={`rounded-3xl px-5 py-4 text-left bg-gradient-to-r ${action.gradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5`}
                    aria-label={action.title}
                  >
                    <ActionIcon className="w-6 h-6 mb-3 text-white" />
                    <p className="text-base font-semibold">{action.title}</p>
                    <p className="text-sm text-white/80">{action.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-[1.7fr_1fr] gap-6">
          <div className="space-y-6">
            <section className={`rounded-3xl border p-6 ${themed('bg-white/90 border-white/70 shadow-xl', 'bg-slate-900/70 border-slate-800 shadow-2xl')}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Vitals today</p>
                  <h2 className="text-2xl font-semibold">Key indicators</h2>
                </div>
                <span className="text-xs uppercase tracking-wide px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200">
                  {overallStatus === 'good' ? 'Stable' : overallStatus === 'warning' ? 'Watch' : 'Alert'}
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {healthCards.map((card) => {
                  const IconComponent = card.icon;
                  const statusColor = getStatusColor(card.status);
                  return (
                    <button
                      key={card.title}
                      onClick={() => speak(`${card.title}: ${card.value} ${card.unit}, ${card.description}`)}
                      className={`${statusColor.bg} ${statusColor.border} border rounded-3xl p-4 text-left hover:shadow-lg transition`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${statusColor.bg} border ${statusColor.border}`}>
                            <IconComponent className={`w-6 h-6 ${statusColor.icon}`} />
                          </div>
                          <div>
                            <p className={`text-sm ${statusColor.text} uppercase tracking-wide`}>{card.title}</p>
                            <p className={`text-xs ${statusColor.text} opacity-80`}>{card.description}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${statusColor.text}`}>{card.trendText}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className={`text-4xl font-bold ${statusColor.text}`}>{card.value}</p>
                        <span className={`text-base ${statusColor.text} opacity-80`}>{card.unit}</span>
                      </div>
                      {card.progress !== undefined && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className={statusColor.trackText}>Progress</span>
                            <span className={`${statusColor.trackValue} font-semibold`}>{card.progress}%</span>
                          </div>
                          <div className={`h-2.5 rounded-full ${statusColor.track}`}>
                            <div className={`h-full ${statusColor.accent} rounded-full transition-all duration-1000`} style={{ width: `${card.progress}%` }} />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className={`rounded-3xl border p-6 ${themed('bg-white/90 border-white/70 shadow-xl', 'bg-slate-900/70 border-slate-800 shadow-2xl')}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Medication & reminders</p>
                  <h2 className="text-2xl font-semibold">Stay on schedule</h2>
                </div>
                <div className={`px-4 py-1 rounded-full text-sm font-semibold ${healthData.medication.taken ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200'}`}>
                  {healthData.medication.taken ? 'Taken' : 'Pending'}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-[220px]">
                  <Pill className="w-10 h-10 text-blue-500" />
                  <div>
                    <p className="text-lg font-semibold">Next dose at {healthData.medication.nextDose}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{healthData.medication.timeLeft}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => speak(`Your next dose is at ${healthData.medication.nextDose}, in ${healthData.medication.timeLeft}`)}
                    className="px-5 py-3 rounded-2xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition flex items-center"
                  >
                    <Volume2 className="w-4 h-4 mr-2" /> Voice reminder
                  </button>
                  <button
                    onClick={() => navigate('/add')}
                    className="px-5 py-3 rounded-2xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 transition"
                  >
                    Add reminder
                  </button>
                </div>
              </div>
            </section>

            <section className={`rounded-3xl border p-6 ${themed('bg-white/90 border-white/70 shadow-xl', 'bg-slate-900/70 border-slate-800 shadow-2xl')}`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Weekly overview</p>
                  <h2 className="text-2xl font-semibold">Health trends</h2>
                </div>
                <div className="flex gap-2">
                  {['Today', 'Week', 'Month'].map((period) => (
                    <span key={period} className={`px-4 py-1 rounded-full text-xs font-semibold ${period === 'Week' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200' : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300'}`}>
                      {period}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`h-48 rounded-3xl border-2 border-dashed flex items-center justify-center text-center ${themed('bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200', 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-700/50')}`}>
                <div>
                  <TrendingUp className={`w-12 h-12 mx-auto mb-3 ${themed('text-blue-500', 'text-blue-200')}`} />
                  <p className="text-lg font-semibold">Heart rate trend</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Interactive chart coming soon</p>
                </div>
              </div>
            </section>

            <section className={`rounded-3xl border p-6 ${themed('bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100 shadow-xl', 'bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-700 shadow-2xl')}`}>
              <div className="flex items-center gap-3 mb-4">
                <Award className={`w-6 h-6 ${themed('text-amber-600', 'text-amber-200')}`} />
                <div>
                  <p className="text-sm text-amber-600 dark:text-amber-200">Warm reminders</p>
                  <h2 className="text-2xl font-semibold">Today’s tips</h2>
                </div>
              </div>
              <div className="space-y-4">
                {careTips.map((tip) => {
                  const TipIcon = tip.Icon;
                  return (
                    <div key={tip.title} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/70 dark:bg-slate-900/60 flex items-center justify-center">
                        <TipIcon className={`w-5 h-5 ${themed('text-amber-600', 'text-amber-200')}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{tip.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{tip.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className={`rounded-3xl border p-6 ${themed('bg-white/90 border-white/70 shadow-xl', 'bg-slate-900/70 border-slate-800 shadow-2xl')}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Overall readiness</p>
                  <h2 className="text-2xl font-semibold">Body balance</h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${overallStatus === 'good' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200' : overallStatus === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200'}`}>
                  {overallStatus.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-6 mt-6">
                <div className="relative w-28 h-28">
                  <svg viewBox="0 0 120 120" className="w-full h-full">
                    <circle cx="60" cy="60" r="52" stroke="currentColor" strokeWidth="12" className="text-gray-200 dark:text-slate-700" fill="transparent" />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-emerald-400"
                      fill="transparent"
                      strokeDasharray={`${readinessScore * 3.27} 999`}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold">{readinessScore}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">/100</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">Encouragement</p>
                  <p className="text-lg font-semibold leading-relaxed mt-1">{encouragement || 'Listening to your body keeps you strong each day.'}</p>
                </div>
              </div>
            </section>

            <section className={`rounded-3xl border p-6 ${themed('bg-white/90 border-white/70 shadow-xl', 'bg-slate-900/70 border-slate-800 shadow-2xl')}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Daily care timeline</p>
                  <h2 className="text-xl font-semibold">Small wins today</h2>
                </div>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {careTimeline.map((event) => (
                  <div key={event.title} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-semibold text-gray-400">{event.time}</span>
                      <span className="w-px flex-1 bg-gray-200 dark:bg-slate-700" />
                    </div>
                    <div className={`flex-1 rounded-2xl p-4 bg-gradient-to-r ${event.accent} text-white shadow`}>
                      <p className="text-sm font-semibold">{event.title}</p>
                      <p className="text-sm text-white/80">{event.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className={`rounded-3xl border p-6 ${themed('bg-white/90 border-white/70 shadow-xl', 'bg-slate-900/70 border-slate-800 shadow-2xl')}`}>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Care team</p>
              <div className="space-y-4">
                {supportContacts.map((contact) => (
                  <div key={contact.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{contact.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{contact.relation}</p>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 text-right max-w-[9rem]">{contact.status}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className={`rounded-3xl border p-6 ${themed('bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100', 'bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-700')}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${themed('bg-orange-100', 'bg-orange-900/40')}`}>
                    <Droplet className={`w-6 h-6 ${themed('text-orange-600', 'text-orange-200')}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Cholesterol</h3>
                    <p className={themed('text-orange-600', 'text-orange-200')}>Blood lipid summary</p>
                  </div>
                </div>
                <span className="px-4 py-2 rounded-2xl bg-white/70 text-orange-700 dark:bg-slate-900/40 dark:text-orange-200">
                  Total {cholesterol.total} mg/dL
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>LDL</span>
                    <span className="font-semibold">{cholesterol.ldl} mg/dL</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/50 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-orange-500" style={{ width: `${Math.min(100, (cholesterol.ldl / 160) * 100)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>HDL</span>
                    <span className="font-semibold">{cholesterol.hdl} mg/dL</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/50 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-emerald-400" style={{ width: `${Math.min(100, (cholesterol.hdl / 60) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </section>

            <section className={`rounded-3xl border p-6 ${themed('bg-gradient-to-r from-rose-50 to-red-50 border-rose-100', 'bg-gradient-to-r from-rose-900/30 to-red-900/30 border-rose-700')}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${themed('bg-red-100', 'bg-red-900/40')}`}>
                    <BatteryCharging className={`w-6 h-6 ${themed('text-red-600', 'text-red-200')}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">AED battery</h3>
                    <p className={themed('text-red-600', 'text-red-200')}>Remaining charge</p>
                  </div>
                </div>
                <span className="px-4 py-2 rounded-2xl bg-white/70 text-red-700 dark:bg-slate-900/40 dark:text-red-200">{aedBattery}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/60 dark:bg-slate-800">
                <div className="h-full rounded-full bg-red-500" style={{ width: `${aedBattery}%` }} />
              </div>
            </section>
          </div>
        </div>

        <button
          onClick={generateHealthReport}
          disabled={isLoading}
          className={`w-full text-white rounded-[32px] p-6 flex items-center justify-center shadow-2xl transform transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group ${themed('bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600', 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500')}`}
          aria-label="Generate health report"
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3" />
              <span className="text-xl font-bold">Generating report...</span>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Download className="w-6 h-6 mr-3 relative z-10" />
              <span className="text-xl font-bold relative z-10">Generate health report</span>
            </>
          )}
        </button>
      </div>

      {recordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRecordModal(null)} />
          <div className={`relative z-10 w-full max-w-md rounded-3xl p-6 shadow-2xl ${themed('bg-white text-gray-800', 'bg-slate-900 text-gray-100')}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{recordModal === 'vaccine' ? 'Vaccination records' : 'Allergy records'}</h3>
              <button className={`transition-colors duration-200 ${themed('text-gray-500 hover:text-gray-700', 'text-gray-300 hover:text-gray-100')}`} onClick={() => setRecordModal(null)} aria-label="Close">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            {recordModal === 'vaccine' ? (
              <div className="space-y-3">
                <div className={`rounded-2xl border p-3 ${themed('border-gray-200 bg-gray-50', 'border-slate-700 bg-slate-800/60')}`}>
                  <p className="font-semibold">Date: 2023-01-12</p>
                  <p className={themed('text-gray-700', 'text-gray-300')}>Brand: BioNTech</p>
                  <p className={themed('text-gray-700', 'text-gray-300')}>Location: Community centre</p>
                </div>
                <div className={`rounded-2xl border p-3 ${themed('border-gray-200 bg-gray-50', 'border-slate-700 bg-slate-800/60')}`}>
                  <p className="font-semibold">Date: 2023-08-03</p>
                  <p className={themed('text-gray-700', 'text-gray-300')}>Brand: Moderna</p>
                  <p className={themed('text-gray-700', 'text-gray-300')}>Location: City hospital</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className={`rounded-2xl border p-3 ${themed('border-gray-200 bg-gray-50', 'border-slate-700 bg-slate-800/60')}`}>
                  <p className="font-semibold">Peanut allergy</p>
                  <p className={themed('text-gray-700', 'text-gray-300')}>Severity: Moderate</p>
                  <p className={themed('text-gray-700', 'text-gray-300')}>Notes: Avoid peanut products</p>
                </div>
                <div className={`rounded-2xl border p-3 ${themed('border-gray-200 bg-gray-50', 'border-slate-700 bg-slate-800/60')}`}>
                  <p className="font-semibold">Penicillin allergy</p>
                  <p className={themed('text-gray-700', 'text-gray-300')}>Severity: Elevated</p>
                  <p className={themed('text-gray-700', 'text-gray-300')}>Notes: Use alternative antibiotics</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ElegantHealthDashboard;