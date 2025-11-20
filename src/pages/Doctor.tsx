import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, Star, ArrowLeft, Stethoscope, HeartPulse, Award } from 'lucide-react';
import { useAccessibility } from '../components/AccessibilitySettings';
import { useThemedClass } from '../hooks/useThemedClass';
import { IconButton, Button } from '../components/ui/Button';

/**
 * Doctor - Doctor management view that surfaces upcoming visits, your medical team,
 * and recommended specialists, aligned with the refined UI and theme system.
 */
const Doctor: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useAccessibility();
  const { themed } = useThemedClass();

  const doctors = [
    { name: 'Dr. Karen Chan', speciality: 'Family Medicine', nextVisit: 'Dec 25 • 2:00 PM', rating: 4, clinic: 'Wan Chai Community Clinic' },
    { name: 'Dr. Adrian Lee', speciality: 'Cardiology', nextVisit: 'Jan 12 • 9:30 AM', rating: 5, clinic: 'Central Grace Hospital' },
    { name: 'Dr. Emily Wong', speciality: 'Orthopedics', nextVisit: 'Feb 5 • 4:00 PM', rating: 4, clinic: 'Kowloon Recovery Centre' },
  ];

  const recommended = [
    { name: 'Dr. William Chow', speciality: 'Internal Medicine', experience: '15 years of experience', rating: 5, clinic: 'Taikoo Health Hub' },
    { name: 'Dr. Elaine Lam', speciality: 'Rehabilitation Medicine', experience: '12 years of experience', rating: 4, clinic: 'Tsuen Wan Rehab Care' },
  ];

  const handleCardSpeak = (message: string) => {
  /**
   * Speak key information aloud to reinforce the accessibility experience.
   */
    speak(message);
  };

  const renderStars = (score: number) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((level) => (
        <Star
          key={level}
          className={`w-5 h-5 ${level <= score ? 'text-yellow-400 fill-yellow-400' : themed('text-gray-300', 'text-slate-600')}`}
        />
      ))}
    </div>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${themed(
        'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-100 text-gray-800',
        'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-gray-100',
      )}`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div className="flex items-center space-x-4">
            <IconButton
              aria-label="Go back"
              icon={ArrowLeft}
              variant="soft"
              size="sm"
              onClick={() => {
                handleCardSpeak('Going back to the previous page');
                navigate(-1);
              }}
              tooltip="Back"
            />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-wide flex items-center space-x-3">
                <span>Doctor Care Hub</span>
                <Stethoscope className="w-7 h-7 text-teal-500" />
              </h1>
              <p className={themed('text-gray-600', 'text-gray-300')}>
                Review your medical team and curated specialist recommendations.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleCardSpeak('Contacting support to help schedule a new appointment')}
            leftIcon={HeartPulse}
          >
            Contact support
          </Button>
        </div>

        <section
          className={`rounded-3xl border px-6 py-8 sm:px-8 mb-10 transition-colors duration-500 ${themed(
            'bg-gradient-to-r from-amber-50 to-orange-100 border-amber-200 text-amber-900',
            'bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-600 text-amber-100',
          )}`}
          role="button"
          tabIndex={0}
          onClick={() => handleCardSpeak('Next visit scheduled on December 25 at 2:00 PM, please arrive at Wan Chai Community Clinic 15 minutes early')}
          onKeyPress={() => handleCardSpeak('Next visit scheduled on December 25 at 2:00 PM, please arrive at Wan Chai Community Clinic 15 minutes early')}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-widest opacity-80 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Next visit</span>
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">December 25 (Wednesday) · 02:00 PM</h2>
              <p className="mt-2 text-lg flex items-center space-x-2">
                <span>Primary doctor: Dr. Karen Chan (Family Medicine)</span>
                <ChevronRight className="w-5 h-5" />
              </p>
              <p className="text-sm mt-2 opacity-80">Location: Wan Chai Community Clinic · Please arrive 15 minutes early.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCardSpeak('Calendar event created')}
              leftIcon={Calendar}
            >
              Add to calendar
            </Button>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold flex items-center space-x-2">
                <span>Your medical team</span>
                <Stethoscope className="w-6 h-6 text-teal-500" />
              </h2>
              <p className={themed('text-gray-600', 'text-gray-300')}>
                Review your trusted doctors and stay on top of clinic updates.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleCardSpeak('The add-doctor feature is coming soon')}
            >
              Add doctor (coming soon)
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor.name}
                className={`rounded-3xl border px-6 py-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] cursor-pointer ${themed(
                  'bg-white border-cyan-100',
                  'bg-slate-900/60 border-slate-700',
                )}`}
                onClick={() =>
                  handleCardSpeak(`${doctor.name}, ${doctor.speciality}, next appointment at ${doctor.nextVisit}.`)
                }
                onKeyPress={() =>
                  handleCardSpeak(`${doctor.name}, ${doctor.speciality}, next appointment at ${doctor.nextVisit}.`)
                }
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{doctor.name}</h3>
                    <p className={themed('text-gray-600', 'text-gray-300')}>{doctor.speciality}</p>
                  </div>
                  <IconButton
                    icon={Calendar}
                    size="xs"
                    variant="soft"
                    tooltip="View schedule"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleCardSpeak(`Schedule reminder for ${doctor.name} has been sent`);
                    }}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <HeartPulse className="w-4 h-4 text-teal-500" />
                    <span>{doctor.clinic}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{doctor.nextVisit}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    {renderStars(doctor.rating)}
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCardSpeak(`A priority slot for ${doctor.name} has been requested. Support will contact you shortly.`);
                      }}
                    >
                      Request priority consult
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center mb-6 space-x-3">
            <Award className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl sm:text-3xl font-bold">Recommended specialists for you</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommended.map((doctor) => (
              <div
                key={doctor.name}
                className={`rounded-3xl border px-6 py-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] ${themed(
                  'bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 border-indigo-200',
                  'bg-gradient-to-br from-indigo-900/30 via-blue-900/30 to-cyan-900/20 border-indigo-600',
                )}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{doctor.name}</h3>
                    <p className={themed('text-gray-600', 'text-gray-300')}>{doctor.speciality}</p>
                  </div>
                  {renderStars(doctor.rating)}
                </div>
                <p className="text-sm">{doctor.experience}</p>
                <p className={`text-sm mt-2 ${themed('text-gray-600', 'text-gray-300')}`}>{doctor.clinic}</p>
                <Button
                  variant="secondary"
                  size="xs"
                  className="mt-4"
                  onClick={() => handleCardSpeak(`Appointment request for ${doctor.name} submitted. Support will contact you soon.`)}
                >
                  Submit appointment request
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Doctor;