import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Tanjore Degree Coffee",
  description: "Privacy policy of Tanjore Degree Coffee website",
};

const PrivacyPolicy: React.FC = () => {
  return (
    <main className="container mx-auto p-6 max-w-4xl pt-26"> 
    
      <div className="flex flex-col items-center mb-12"> 
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
        <p className="text-gray-600"><strong>Effective Date:</strong> 19 March 2025</p>
      </div>

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Information We Collect</h2>

        <h3 className="text-xl font-medium mt-4 mb-2 text-gray-700">a. Personal Information</h3>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Billing and shipping address (if applicable)</li>
        </ul>

        <h3 className="text-xl font-medium mt-4 mb-2 text-gray-700">b. Non-Personal Information</h3>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>Browser type and version</li>
          <li>IP address</li>
          <li>Device information</li>
          <li>Cookies and usage data</li>
        </ul>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>To process orders and transactions</li>
          <li>To improve our website and services</li>
          <li>To send promotional emails (if subscribed)</li>
          <li>To analyze website traffic and user behavior</li>
        </ul>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Sharing of Information</h2>
        <p className="text-gray-600">
          We do not sell, trade, or rent personal information to third parties. However, we may share information with trusted third-party services to process payments, manage analytics, or enhance our services.
        </p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Cookies</h2>
        <p className="text-gray-600">
          We use cookies to improve user experience. You can choose to disable cookies in your browser settings.
        </p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Your Rights</h2>
        <p className="text-gray-600">
          You have the right to access, update, or delete your personal data. Contact us if you wish to make changes.
        </p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Contact Information</h2>
        <p className="text-gray-600">
          If you have any questions regarding this privacy policy, please contact us at: <strong>support@tanjoredegreecoffee.com</strong>
        </p>
      </section>
    </main>
  );
};

export default PrivacyPolicy;