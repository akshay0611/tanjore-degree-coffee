import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Tanjore Degree Coffee",
  description: "Privacy policy of Tanjore Degree Coffee website",
};

const PrivacyPolicy: React.FC = () => {
  return (
    <main className="container mx-auto p-6 max-w-4xl pt-24">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-16">
        <h1 className="text-5xl font-bold text-gray-800 mb-4 text-center bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-gray-600 text-lg">
          <strong>Effective Date:</strong> 19 March 2025
        </p>
      </div>

      {/* Section 1: Information We Collect */}
      <section className="bg-white p-8 rounded-xl shadow-lg mb-10 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
          1. Information We Collect
        </h2>

        <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-700">
          a. Personal Information
        </h3>
        <ul className="list-disc pl-8 text-gray-600 space-y-3">
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Billing and shipping address (if applicable)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-700">
          b. Non-Personal Information
        </h3>
        <ul className="list-disc pl-8 text-gray-600 space-y-3">
          <li>Browser type and version</li>
          <li>IP address</li>
          <li>Device information</li>
          <li>Cookies and usage data</li>
        </ul>
      </section>

      {/* Section 2: How We Use Your Information */}
      <section className="bg-white p-8 rounded-xl shadow-lg mb-10 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc pl-8 text-gray-600 space-y-3">
          <li>To process orders and transactions</li>
          <li>To improve our website and services</li>
          <li>To send promotional emails (if subscribed)</li>
          <li>To analyze website traffic and user behavior</li>
        </ul>
      </section>

      {/* Section 3: Sharing of Information */}
      <section className="bg-white p-8 rounded-xl shadow-lg mb-10 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
          3. Sharing of Information
        </h2>
        <p className="text-gray-600 leading-relaxed">
          We do not sell, trade, or rent personal information to third parties. However, we may share information with trusted third-party services to process payments, manage analytics, or enhance our services.
        </p>
      </section>

      {/* Section 4: Cookies */}
      <section className="bg-white p-8 rounded-xl shadow-lg mb-10 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
          4. Cookies
        </h2>
        <p className="text-gray-600 leading-relaxed">
          We use cookies to improve user experience. You can choose to disable cookies in your browser settings.
        </p>
      </section>

      {/* Section 5: Your Rights */}
      <section className="bg-white p-8 rounded-xl shadow-lg mb-10 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
          5. Your Rights
        </h2>
        <p className="text-gray-600 leading-relaxed">
          You have the right to access, update, or delete your personal data. Contact us if you wish to make changes.
        </p>
      </section>

      {/* Section 6: Contact Information */}
      <section className="bg-white p-8 rounded-xl shadow-lg mb-10 hover:shadow-xl transition-shadow duration-300">
  <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
    6. Contact Information
  </h2>
  <p className="text-gray-600 leading-relaxed">
    If you have any questions regarding this privacy policy, please contact us at:{" "}
    <a
      href="mailto:support@tanjoredegreecoffee.com"
      className="text-amber-700 hover:text-amber-900 transition-colors duration-200"
    >
      support@tanjoredegreecoffee.com
    </a>
  </p>
</section>
    </main>
  );
};

export default PrivacyPolicy;