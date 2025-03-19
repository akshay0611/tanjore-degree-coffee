import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Tanjore Degree Coffee",
  description: "Terms of Service for Tanjore Degree Coffee website",
};

const TermsOfService: React.FC = () => {
  return (
    <main className="container mx-auto p-6 max-w-4xl pt-26">
     
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms of Service</h1>
        <p className="text-gray-600"><strong>Effective Date:</strong> 19 March 2025</p>
      </div>

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Acceptance of Terms</h2>
        <p className="text-gray-600">
          By accessing and using our website, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, you must discontinue use of our services immediately.
        </p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Use of Our Services</h2>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>You must be at least 18 years old or have parental consent to use our website.</li>
          <li>You agree not to use our services for any illegal or unauthorized purposes.</li>
          <li>We reserve the right to refuse service to anyone for any reason at any time.</li>
        </ul>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Intellectual Property</h2>
        <p className="text-gray-600">
          All content, including text, images, logos, and trademarks on this site, are the property of Tanjore Degree Coffee. You may not reproduce, distribute, or use any content without our written permission.
        </p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Limitation of Liability</h2>
        <p className="text-gray-600">
          We are not responsible for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services.
        </p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Modifications to Terms</h2>
        <p className="text-gray-600">
          We reserve the right to modify or update these Terms of Service at any time. Continued use of our services after changes means you accept the new terms.
        </p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Contact Information</h2>
        <p className="text-gray-600">
          If you have any questions about these Terms of Service, please contact us at: <strong>support@tanjoredegreecoffee.com</strong>
        </p>
      </section>
    </main>
  );
};

export default TermsOfService;
