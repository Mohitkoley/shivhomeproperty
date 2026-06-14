'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShowConsent(false);
  };

  const declineCookies = () => {
    // For now, declining still closes the banner but sets a different value or nothing
    // Depending on strict privacy laws, we might disable tracking here
    localStorage.setItem('cookie-consent', 'declined');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md text-slate-800 p-6 rounded-2xl shadow-2xl border border-white/20 pointer-events-auto transform transition-all duration-500 translate-y-0">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full shrink-0">
              <Cookie className="w-6 h-6" />
            </div>
            <div className="text-sm leading-relaxed text-slate-600">
              <h3 className="text-base font-semibold text-slate-900 mb-1">We value your privacy</h3>
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies as described in our{' '}
              <Link href="/privacy-policy" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/terms-and-conditions" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                Terms & Conditions
              </Link>.
            </div>
          </div>
          <div className="flex w-full md:w-auto shrink-0 gap-3 justify-end">
            <button
              onClick={declineCookies}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors whitespace-nowrap text-sm"
            >
              Decline
            </button>
            <button
              onClick={acceptCookies}
              className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors whitespace-nowrap shadow-md shadow-blue-500/20 text-sm"
            >
              Accept All
            </button>
          </div>
        </div>
        <button 
          onClick={declineCookies}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
