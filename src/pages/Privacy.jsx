import { Link } from 'react-router-dom'

const LAST_UPDATED = 'May 15, 2026'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-10">
          <Link to="/" className="text-sm text-primary font-semibold flex items-center gap-1.5 mb-6 hover:underline">
            <i className="fas fa-arrow-left text-xs" /> Back to Hestia
          </Link>
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">1. Who We Are</h2>
            <p>Hestia Real Estate ("Hestia", "we", "us", "our") is an online real estate platform operating in Tunisia. Our platform connects property buyers, renters, and investors with real estate agents and developers.</p>
            <p className="mt-2">Platform: <a href="https://hestia-swart.vercel.app" className="text-primary hover:underline">hestia-swart.vercel.app</a></p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
            <p className="font-semibold text-gray-700 mb-2">Information you provide directly:</p>
            <ul className="list-disc pl-5 space-y-1.5 mb-4">
              <li>Name, email address, and phone number when you register</li>
              <li>Property search preferences and saved searches</li>
              <li>Messages sent to agents through our platform</li>
              <li>Viewing booking requests</li>
              <li>Property listings submitted by agents</li>
            </ul>
            <p className="font-semibold text-gray-700 mb-2">Information collected automatically:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Browser type and device information</li>
              <li>Pages visited and time spent on the platform</li>
              <li>IP address and approximate location</li>
              <li>Property listings you viewed</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To provide and improve our real estate search platform</li>
              <li>To connect you with agents and properties matching your criteria</li>
              <li>To send you property alerts based on your saved searches</li>
              <li>To process viewing bookings and enquiries</li>
              <li>To communicate platform updates, listings, and promotions</li>
              <li>To verify agent identities and maintain platform integrity</li>
              <li>To comply with applicable Tunisian laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">4. Sharing Your Information</h2>
            <p>We do not sell your personal information. We share your data only in the following cases:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-3">
              <li><strong>With agents:</strong> When you send an enquiry or book a viewing, your name, contact details, and message are shared with the relevant agent.</li>
              <li><strong>Service providers:</strong> We use Supabase (database and authentication), Vercel (hosting), and Resend (email delivery). These providers process data on our behalf under strict confidentiality.</li>
              <li><strong>Legal requirements:</strong> We may disclose data when required by Tunisian law or legal process.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">5. Data Retention</h2>
            <p>We retain your personal data for as long as your account is active. You may request deletion of your account and data at any time by contacting us. Agent listings and transaction records may be retained for legal compliance purposes.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-3">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for marketing communications at any time</li>
              <li>Lodge a complaint with the relevant Tunisian data protection authority</li>
            </ul>
            <p className="mt-3">To exercise these rights, email us at: <a href="mailto:privacy@hestia.tn" className="text-primary hover:underline">privacy@hestia.tn</a></p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">7. Cookies</h2>
            <p>We use essential cookies to maintain your session and preferences (such as language selection). We do not use third-party advertising cookies. You can control cookies through your browser settings.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">8. Security</h2>
            <p>We use industry-standard security measures including encrypted data transmission (HTTPS), secure authentication via Supabase Auth, and row-level security on our database. No method of transmission over the internet is 100% secure; we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">9. Changes to This Policy</h2>
            <p>We may update this policy from time to time. We will notify registered users of material changes by email. Continued use of the platform after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">10. Contact</h2>
            <p>For any privacy-related questions or requests:</p>
            <div className="bg-gray-50 rounded-xl p-4 mt-3 space-y-1 text-sm">
              <p><strong>Hestia Real Estate</strong></p>
              <p>Email: <a href="mailto:privacy@hestia.tn" className="text-primary hover:underline">privacy@hestia.tn</a></p>
              <p>Tunisia</p>
            </div>
          </section>
        </div>

        {/* Footer nav */}
        <div className="border-t border-gray-100 mt-12 pt-6 flex gap-6 text-sm text-gray-400">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/terms" className="hover:text-primary">Terms of Use</Link>
        </div>
      </div>
    </div>
  )
}
