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
      return '請輸入8位數字的香港手機號碼';
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
    speak('登入成功，正在前往主頁');
    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    navigate('/home');
  };

  const handleHelp = () => {
    speak('如果需要幫助，請聯繫家人或工作人員');
    alert('需要幫助？請聯繫家人或社區中心工作人員。');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-500 to-teal-600">
      {/* 顶部装饰与标语区域 */}
      <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="text-white">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg leading-relaxed">
              「隨時隨地，關懷無憂」


            </p>
          </div>
        </div>
      </div>

      {/* 白色卡片区域 */}
      <div className="relative -mt-12 sm:-mt-16">
        <div className="mx-auto max-w-md px-6">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
            {/* 标题与说明 */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                  你好，很高興認識你
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                請連結到您的醫健通 EHealth 進行登入。
              </p>
            </div>

            {/* 表单 */}
            <form onSubmit={handleContinue} aria-label="登入表單">
              <label className="block text-gray-800 font-semibold mb-2 text-base" htmlFor="mobile">
                手機號碼
              </label>
              <div className="flex items-stretch space-x-2">
                {/* 國碼選擇 */}
                <div className="relative w-24">
                  <select
                    id="countryCode"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full h-12 border-2 border-gray-300 rounded-2xl px-3 text-gray-800 text-base focus:outline-none focus:ring-4 focus:ring-teal-200 focus:border-teal-500 appearance-none bg-white"
                    aria-label="國碼選擇"
                  >
                    <option value="+852">+852</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    ▼
                  </div>
                </div>

                {/* 手機號碼輸入 */}
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

              {/* 繼續按鈕 */}
              <button
                type="submit"
                className="mt-6 w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-semibold text-lg shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-4 focus:ring-teal-300"
                aria-label="繼續登入"
              >
                繼續
              </button>
            </form>

            {/* 分隔線與"或者" */}
            <div className="my-6">
              <div className="flex items-center">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="mx-3 text-gray-500 text-sm">或者</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            </div>

            {/* 社交登入 */}
            <div className="flex items-center justify-center space-x-4">
              <button
                type="button"
                className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl shadow-md hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-gray-400"
                aria-label="以 Apple 登入"
                onClick={() => speak('Apple 登入功能暫未開放')}
              >
                {/**
                 * 使用向量格式的蘋果圖示以確保在不同解析度裝置上保持清晰，並遵守品牌視覺。
                 */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 fill-current text-white mx-auto"
                  aria-hidden="true"
                  role="img"
                >
                  {/**
                   * 將圖示略為向右平移以修正蘋果 Logo 原始向左偏重的視覺重心，讓它在圓形按鈕中看起來居中。
                   */}
                  <g transform="translate(3 0)">
                    <path d="M16.365 1.43c0 1.12-.47 2.2-1.29 3.03-.94.95-2.33 1.52-3.68 1.43-.1-1.05.31-2.2 1.15-3.04.85-.89 2.23-1.53 3.44-1.62.04.1.04.2.04.2.04.2.04.4.04.4zm3.29 15.22c-.57 1.36-.84 1.99-1.57 3.22-1.02 1.76-2.46 3.97-4.23 3.99-1.57.04-2.07-1.06-4.3-1.05-2.22.01-2.81 1.08-4.38 1.04-1.77-.03-3.12-1.99-4.14-3.75-2.83-4.9-3.13-10.66-1.38-13.7 1.25-2.17 3.55-3.56 6-3.59 1.57-.03 3.02 1.05 4.3 1.05s2.95-1.3 4.97-1.11c.84.03 3.2.34 4.71 2.61-.12.07-2.82 1.65-2.8 4.92.02 3.89 3.44 5.18 3.47 5.2z" />
                  </g>
                </svg>
              </button>
              <button
                type="button"
                className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 text-red-500 flex items-center justify-center font-bold text-xl shadow-md hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-red-200"
                aria-label="以 Google 登入"
                onClick={() => speak('Google 登入功能暫未開放')}
              >
                G
              </button>
              <button
                type="button"
                className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
                aria-label="以 Facebook 登入"
                onClick={() => speak('Facebook 登入功能暫未開放')}
              >
                f
              </button>
              <button
                type="button"
                className="px-4 h-12 rounded-2xl bg-white border-2 border-gray-300 text-gray-700 flex items-center justify-center text-sm font-semibold shadow-md hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-gray-200"
                aria-label="以 醫健通 eHealth 登入"
                onClick={() => speak('醫健通登入功能暫未開放')}
              >
                醫健通<br />eHealth
              </button>
            </div>

            {/* 幫助區域 */}
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={handleHelp}
                className="text-teal-700 hover:text-teal-800 font-semibold text-base underline underline-offset-4 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-teal-200 rounded-lg px-2 py-1"
                aria-label="需要幫助嗎？"
              >
                需要幫助嗎？
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 底部安全區 */}
      <div className="h-8" />
    </div>
  );
};

export default ElegantLogin;
