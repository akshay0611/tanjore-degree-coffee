import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Tanjore Degree Coffee",
  description: "Terms of Service for Tanjore Degree Coffee website",
};

const TermsOfService: React.FC = () => {
  return (
    <main className="container mx-auto p-6 max-w-4xl pt-24">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-16">
        <h1 className="text-5xl font-bold text-gray-800 mb-4 text-center bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <p className="text-gray-600 text-lg">
          <strong>Effective Date:</strong> 19 March 2025
        </p>
      </div>

      {/* Section 1: Acceptance of Terms */}
      <section className="bg-white p-8 rounded-xl shadow-lg mb-10 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
          1. Acceptance of Terms
        </h2>
        <p className="text-gray-600 leading-relaxed">
          By accessing and using our website, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, you must discontinue use of our services immediately.
        </p>
      </section>

      {/* Section 2: Use of Our Services */}
      <section className="bg-white p-8 rounded-xl shadow-lg mb-10 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
          2. Use of Our Services
        </h2>
        <ul className="list-disc pl-8 text-gray-600 space-y-3">
          <li>You must be at least 18 years old or have parental consent to use our website.</li>
          <li>You agree not to use our services for any illegal or unauthorized purposes.</li>
          <li>We reserve the right to refuse service to anyone for any reason at any time.</li>
        </ul>
      </section>

      {/* Section 3: Intellectual Property */}
      <section className="bg-white p-8 rounded-xl shadow-lg mb-10 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
          3. Intellectual Property
        </h2>
        <p className="text-gray-600 leading-relaxed">
          All content, including text, images, logos, and trademarks on this site, are the property of Tanjore Degree Coffee. You may not reproduce, distribute, or use any content without our written permission.
        </p>
      </section>

      {/* Section 4: Limitation of Liability */}
      <section className="bg-white p-8 rounded-xl shadow-lg mb-10 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
          4. Limitation of Liability
        </h2>
        <p className="text-gray-600 leading-relaxed">
          We are not responsible for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services.
        </p>
      </section>

      {/* Section 5: Modifications to Terms */}
      <section className="bg-white p-8 rounded-xl shadow-lg mb-10 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
          5. Modifications to Terms
        </h2>
        <p className="text-gray-600 leading-relaxed">
          We reserve the right to modify or update these Terms of Service at any time. Continued use of our services after changes means you accept the new terms.
        </p>
      </section>

      {/* Section 6: Contact Information */}
      <section className="bg-white p-8 rounded-xl shadow-lg mb-10 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
          6. Contact Information
        </h2>
        <p className="text-gray-600 leading-relaxed">
          If you have any questions about these Terms of Service, please contact us at:{" "}
          <a
            href="mailto:support@tanjoredegreecoffee.com"
            className="text-amber-700 hover:text-amber-900  transition-colors duration-200"
          >
            support@tanjoredegreecoffee.com
          </a>
        </p>
      </section>
    </main>
  );
};

export default TermsOfService;