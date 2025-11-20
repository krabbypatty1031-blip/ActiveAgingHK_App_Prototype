import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../components/AccessibilitySettings';

const ElegantLogin: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useAccessibility();

  const [countryCode, setCountryCode] = useState('+852');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    const digitsOnly = mobile.replace(/\D/g, '');
    if (digitsOnly.length !== 8) {
      return 'Please enter an 8-digit Hong Kong mobile number';
    }
    return '';
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      speak(err);
      if (navigator.vibrate) navigator.vibrate(100);
      return;
    }
    setError('');
    speak('Sign-in successful, navigating to Home');
    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    navigate('/home');
  };

  const handleHelp = () => {
    speak('If you need help, please contact your family or staff');
    alert('Need help? Please contact your family or community center staff.');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="text-teal-800">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg leading-relaxed">
              Care Anytime, Anywhere


            </p>
          </div>
        </div>
      </div>

      {/* White card section */}
      <div className="relative -mt-12 sm:-mt-16">
        <div className="mx-auto max-w-md px-6">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
            {/* Logo, heading and description */}
            <div className="text-center mb-3">
              <div className="flex items-center justify-center mb-4">
                <img
                  src={`${import.meta.env.BASE_URL}activeagehk.png`}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `${import.meta.env.BASE_URL}UI.png`;
                  }}
                  alt="ActiveAge HK logo"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-lg"
                />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2 whitespace-nowrap">Hi, please sign in to continue</h1>
              <p className="text-base sm:text-lg text-gray-400">
                Please use your mobile number to sign in.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleContinue} aria-label="Sign-in form">
              <label className="block text-gray-800 font-semibold mb-2 text-base" htmlFor="mobile">
                Mobile number
              </label>
              <div className="flex items-stretch space-x-2">
                {/* Country code selector */}
                <div className="relative w-24">
                  <select
                    id="countryCode"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full h-12 border-2 border-gray-300 rounded-2xl px-3 text-gray-800 text-base focus:outline-none focus:ring-4 focus:ring-teal-200 focus:border-teal-500 appearance-none bg-white"
                    aria-label="Country code"
                  >
                    <option value="+852">+852</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    ▼
                  </div>
                </div>

                {/* Mobile number field */}
                <input
                  id="mobile"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="flex-1 h-12 border-2 border-gray-300 rounded-2xl px-4 text-gray-800 text-base placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all duration-200"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'mobile-error' : undefined}
                />
              </div>

              {error && (
                <p id="mobile-error" className="mt-2 text-red-600 text-sm font-medium" role="alert">
                  ⚠ {error}
                </p>
              )}

              {/* Continue button */}
              <button
                type="submit"
                className="mt-6 w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-semibold text-lg shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-4 focus:ring-teal-300"
                aria-label="Continue to sign in"
              >
                Continue
              </button>
            </form>

            {/* Divider with "or" */}
            <div className="my-6">
              <div className="flex items-center">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="mx-3 text-gray-500 text-sm">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            </div>

            {/* Social login */}
            <div className="flex items-center justify-center space-x-4">
              <button
                type="button"
                className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl shadow-md hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-gray-400"
                aria-label="Sign in with Apple"
                onClick={() => speak('Apple sign-in is not available yet')}
              >
                {/**
                 * Use a vector apple icon to keep it crisp on all displays and aligned with branding.
                 */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 fill-current text-white mx-auto"
                  aria-hidden="true"
                  role="img"
                >
                  {/**
                   * Slightly translate the icon to the right to visually centre the Apple logo inside the circle.
                   */}
                  <g transform="translate(3 0)">
                    <path d="M16.365 1.43c0 1.12-.47 2.2-1.29 3.03-.94.95-2.33 1.52-3.68 1.43-.1-1.05.31-2.2 1.15-3.04.85-.89 2.23-1.53 3.44-1.62.04.1.04.2.04.2.04.2.04.4.04.4zm3.29 15.22c-.57 1.36-.84 1.99-1.57 3.22-1.02 1.76-2.46 3.97-4.23 3.99-1.57.04-2.07-1.06-4.3-1.05-2.22.01-2.81 1.08-4.38 1.04-1.77-.03-3.12-1.99-4.14-3.75-2.83-4.9-3.13-10.66-1.38-13.7 1.25-2.17 3.55-3.56 6-3.59 1.57-.03 3.02 1.05 4.3 1.05s2.95-1.3 4.97-1.11c.84.03 3.2.34 4.71 2.61-.12.07-2.82 1.65-2.8 4.92.02 3.89 3.44 5.18 3.47 5.2z" />
                  </g>
                </svg>
              </button>
              <button
                type="button"
                className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 text-red-500 flex items-center justify-center font-bold text-xl shadow-md hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-red-200"
                aria-label="Sign in with Google"
                onClick={() => speak('Google sign-in is not available yet')}
              >
                G
              </button>
              <button
                type="button"
                className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
                aria-label="Sign in with Facebook"
                onClick={() => speak('Facebook sign-in is not available yet')}
              >
                f
              </button>
              <button
                type="button"
                className="px-4 h-12 rounded-2xl bg-white border-2 border-gray-300 text-gray-700 flex items-center justify-center text-sm font-semibold shadow-md hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-gray-200"
                aria-label="Sign in with eHealth"
                onClick={() => speak('eHealth sign-in is not available yet')}
              >
                eHealth
              </button>
            </div>

            {/* Help section */}
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={handleHelp}
                className="text-teal-700 hover:text-teal-800 font-semibold text-base underline underline-offset-4 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-teal-200 rounded-lg px-2 py-1"
                aria-label="Need help?"
              >
                Need help?
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom safe area */}
      <div className="h-8" />
    </div>
  );
};

export default ElegantLogin;
