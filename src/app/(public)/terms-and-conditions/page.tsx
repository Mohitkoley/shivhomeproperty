import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Shiv Home Property PG',
  description: 'Terms and Conditions for Shiv Home Property PG',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p className="text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4 mt-8">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website and our services, you accept and agree to be bound by the terms and provision of this agreement. 
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4 mt-8">2. Use of Services</h2>
            <p>
              Our services are intended for individuals seeking PG accommodations. You agree to use the services only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else&apos;s use and enjoyment of the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4 mt-8">3. Booking and Payments</h2>
            <p>
              All bookings made through the website or our associated channels are subject to availability and our acceptance. Any payments or deposits made are subject to our refund and cancellation policies outlined at the time of booking.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4 mt-8">4. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will do our best to notify you of any significant changes, but it is your responsibility to check this page regularly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4 mt-8">5. Contact Information</h2>
            <p>
              If you have any questions about these Terms & Conditions, please contact us at:
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
