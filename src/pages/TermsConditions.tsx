import { Link } from "react-router-dom";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl border border-green-100 p-8 md:p-12">

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-green-800 mb-3">
              Terms & Conditions
            </h1>
            <p className="text-sm text-gray-500">
              Last updated: January 2026
            </p>
          </div>

          {/* Introduction */}
          <p className="text-gray-700 leading-relaxed mb-10">
            By accessing or using Sehat Saathi Guide, you agree to comply with
            these Terms & Conditions. If you do not agree, please discontinue
            use of this website.
          </p>

          {/* Sections */}
          <div className="space-y-10 text-gray-700 leading-relaxed">

            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-green-700 mb-3">
                1. Purpose of the Platform
              </h2>
              <p>
                Sehat Saathi Guide provides general health-related guidance
                powered by technology. It is not a replacement for professional
                medical diagnosis, treatment, or advice.
              </p>
            </section>

            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-green-700 mb-3">
                2. Medical Disclaimer
              </h2>
              <p>
                All content and recommendations are for informational purposes
                only. You should always consult a qualified medical professional
                before making health decisions.
              </p>
            </section>

            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-green-700 mb-3">
                3. User Responsibilities
              </h2>
              <p>
                You agree not to misuse the platform, submit false information,
                attempt to breach security, or use the service for unlawful
                purposes.
              </p>
            </section>

            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-green-700 mb-3">
                4. Limitation of Liability
              </h2>
              <p>
                Sehat Saathi Guide and its developers are not responsible for any
                damages, health outcomes, or losses resulting from the use of
                this website.
              </p>
            </section>

            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-green-700 mb-3">
                5. Service Availability
              </h2>
              <p>
                We may modify, suspend, or discontinue any part of the platform
                at any time without prior notice.
              </p>
            </section>

            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-green-700 mb-3">
                6. Intellectual Property
              </h2>
              <p>
                All website content, design, and code belong to Sehat Saathi
                Guide unless otherwise stated. You may not copy, reproduce,
                or reuse it without permission.
              </p>
            </section>

            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-green-700 mb-3">
                7. Changes to Terms
              </h2>
              <p>
                These terms may be updated at any time. Continued use of the
                platform indicates acceptance of the latest version.
              </p>
            </section>

          </div>

          {/* Back Button */}
          <div className="mt-12 border-t pt-6">
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