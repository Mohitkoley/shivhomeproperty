import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Shiv Home Property PG',
  description: 'Privacy Policy for Shiv Home Property PG',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p className="text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4 mt-8">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you use our website, such as when you fill out a contact form, book a PG, or communicate with us.
              This may include your name, email address, phone number, and any other details you choose to provide.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4 mt-8">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, communicate with you, process your bookings, and respond to your inquiries.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4 mt-8">3. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4 mt-8">4. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Phone: +91 8828764628</li>
              <li>Email: contact@shivhomeproperty.com</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
