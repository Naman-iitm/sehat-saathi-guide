import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl border border-green-100 p-8 md:p-12">

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-green-800 mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500">
              Last updated: January 2026
            </p>
          </div>

          {/* Introduction */}
          <p className="text-gray-700 leading-relaxed mb-10">
            Sehat Saathi Guide respects your privacy and is committed to
            protecting your personal information. This Privacy Policy explains
            how we collect, use, store, process, and safeguard your data when
            you use our website and services.
          </p>

          <div className="space-y-10 text-gray-700 leading-relaxed">

            {/* 1 */}
            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-green-700 mb-3">
                1. Information We Collect
              </h2>
              <p>
                We may collect limited personal and non-personal information
                when you interact with our platform. This may include:
              </p>
              <ul className="list-disc ml-6 mt-3 space-y-2">
                <li>Basic contact information (if voluntarily provided)</li>
                <li>Health-related queries entered into the system</li>
                <li>Device, browser, and usage analytics data</li>
                <li>Technical logs for system improvement</li>
              </ul>
              <p className="mt-3">
                We do not require mandatory account creation to access core
                features of the platform.
              </p>
            </section>

            {/* 2 */}
            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-green-700 mb-3">
                2. How Your Information Is Used
              </h2>
              <p>Your information may be used to:</p>
              <ul className="list-disc ml-6 mt-3 space-y-2">
                <li>Provide relevant health guidance</li>
                <li>Improve AI accuracy and user experience</li>
                <li>Enhance platform security</li>
                <li>Prevent abuse or misuse of services</li>
              </ul>
              <p className="mt-3">
                We do not sell, rent, or trade your personal information to
                third parties.
              </p>
            </section>

            {/* 3 */}
            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-green-700 mb-3">
                3. Data Retention
              </h2>
              <p>
                We retain data only for as long as necessary to provide our
                services and improve system performance. Non-essential data
                may be periodically deleted or anonymized.
              </p>
            </section>

            {/* 4 */}
            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-green-700 mb-3">
                4. Cookies and Tracking Technologies
              </h2>
              <p>
                Our platform may use cookies and similar technologies to
                enhance user experience, remember preferences, and analyze
                traffic patterns. You can manage cookie settings through your
                browser.
              </p>
            </section>

            {/* 5 */}
            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-green-700 mb-3">
                5. Data Security
              </h2>
              <p>
                We implement standard technical and organizational measures
                to protect your information. However, no online system can
                guarantee absolute security, and use of the platform is at
                your own discretion.
              </p>
            </section>

            {/* 6 */}
            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-green-700 mb-3">
                6. Third-Party Services
              </h2>
              <p>
                We may use third-party APIs, hosting providers, and analytics
                tools to operate the platform. These services may process
                limited technical data required to function.
              </p>
            </section>

            {/* 7 */}
            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-green-700 mb-3">
                7. Children's Privacy
              </h2>
              <p>
                Our platform is not specifically designed for children under
                the age of 13. We do not knowingly collect personal information
                from minors.
              </p>
            </section>

            {/* 8 */}
            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-green-700 mb-3">
                8. Your Rights
              </h2>
              <p>
                You may request access, correction, or deletion of personal
                information you have voluntarily provided. You may also stop
                using the website at any time.
              </p>
            </section>

            {/* 9 */}
            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-green-700 mb-3">
                9. Policy Updates
              </h2>
              <p>
                This Privacy Policy may be updated periodically to reflect
                improvements, operational changes, or legal requirements.
                Continued use of the platform indicates acceptance of the
                updated policy.
              </p>
            </section>

          </div>

          {/* Contact Section */}
          <div className="mt-12 border-t pt-6">
            <h3 className="text-lg font-semibold text-green-700 mb-3">
              Contact Us
            </h3>
            <p className="text-gray-600 mb-6">
              If you have questions or concerns about this Privacy Policy,
              please contact the Sehat Saathi Guide development team.
            </p>

            <Link
              to="/"
              className="text-green-700 hover:text-green-900 hover:underline font-medium transition"
            >
              ← Back to Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}