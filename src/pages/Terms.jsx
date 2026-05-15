import { Link } from 'react-router-dom'

const LAST_UPDATED = 'May 15, 2026'

export default function Terms() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-3xl mx-auto px-4 py-12">

        <div className="mb-10">
          <Link to="/" className="text-sm text-primary font-semibold flex items-center gap-1.5 mb-6 hover:underline">
            <i className="fas fa-arrow-left text-xs" /> Back to Hestia
          </Link>
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">Terms of Use</h1>
          <p className="text-gray-400 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using the Hestia Real Estate platform ("Platform"), you agree to be bound by these Terms of Use. If you do not agree, do not use the Platform. These terms apply to all users including buyers, renters, agents, and developers.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">2. Platform Description</h2>
            <p>Hestia is an online real estate marketplace operating in Tunisia. We provide a platform for:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-3">
              <li>Searching and browsing property listings</li>
              <li>Contacting real estate agents</li>
              <li>Booking property viewings</li>
              <li>Agents to manage and publish property listings</li>
              <li>Developers to showcase new real estate projects</li>
            </ul>
            <p className="mt-3">Hestia acts as an intermediary platform. We are not a real estate agency and do not directly buy, sell, or rent properties.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">3. User Accounts</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You must be at least 18 years old to create an account</li>
              <li>You are responsible for maintaining the confidentiality of your credentials</li>
              <li>You must provide accurate and current information during registration</li>
              <li>One person may not maintain multiple accounts</li>
              <li>You are responsible for all activity that occurs under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">4. Agent Listings</h2>
            <p>Agents publishing listings on Hestia agree to:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-3">
              <li>Provide accurate, truthful, and complete property information</li>
              <li>Only list properties they are authorised to market</li>
              <li>Use original or properly licensed photographs</li>
              <li>Update or remove listings that are no longer available</li>
              <li>Not publish duplicate, fraudulent, or misleading listings</li>
              <li>Respond to buyer enquiries in a timely and professional manner</li>
            </ul>
            <p className="mt-3">Hestia reserves the right to remove any listing that violates these terms and to suspend or terminate agent accounts for violations.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">5. Prohibited Uses</h2>
            <p>You may not use the Platform to:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-3">
              <li>Post false, misleading, or fraudulent content</li>
              <li>Scrape, copy, or redistribute Platform content without permission</li>
              <li>Harass, threaten, or harm other users</li>
              <li>Violate any applicable Tunisian law or regulation</li>
              <li>Attempt to gain unauthorised access to our systems</li>
              <li>Use the Platform for money laundering or other illegal financial activities</li>
              <li>Send unsolicited commercial communications</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">6. Disclaimers</h2>
            <p>Hestia provides the Platform "as is" without warranties of any kind. In particular:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-3">
              <li>We do not guarantee the accuracy of listing information provided by agents</li>
              <li>Property prices, availability, and details are subject to change</li>
              <li>We are not responsible for the outcome of transactions between buyers and agents</li>
              <li>We do not verify all agent credentials, though we make reasonable efforts to do so</li>
              <li>Always conduct your own due diligence before entering into any property transaction</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">7. Intellectual Property</h2>
            <p>The Hestia platform, logo, design, and original content are owned by Hestia Real Estate and protected by copyright. You may not reproduce, distribute, or create derivative works without our written permission. Agent-uploaded content remains the property of the agent, who grants Hestia a licence to display it on the Platform.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by Tunisian law, Hestia shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform, including but not limited to loss of profit, loss of data, or damage arising from reliance on listing information.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">9. Termination</h2>
            <p>We reserve the right to suspend or terminate your access to the Platform at any time, with or without notice, for any violation of these Terms. You may also delete your account at any time from your account settings.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">10. Governing Law</h2>
            <p>These Terms are governed by the laws of the Republic of Tunisia. Any disputes arising from these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts of Tunis.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">11. Changes to Terms</h2>
            <p>We may update these Terms from time to time. We will notify registered users of material changes. Continued use of the Platform after changes are posted constitutes your acceptance of the new Terms.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">12. Contact</h2>
            <div className="bg-gray-50 rounded-xl p-4 mt-3 space-y-1 text-sm">
              <p><strong>Hestia Real Estate</strong></p>
              <p>Email: <a href="mailto:legal@hestia.tn" className="text-primary hover:underline">legal@hestia.tn</a></p>
              <p>Tunisia</p>
            </div>
          </section>
        </div>

        <div className="border-t border-gray-100 mt-12 pt-6 flex gap-6 text-sm text-gray-400">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}
