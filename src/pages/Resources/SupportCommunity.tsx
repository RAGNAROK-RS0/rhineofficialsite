import React from 'react';
import Layout from '../../components/Layout';

export default function SupportCommunity() {
  return (
    <Layout themeColor="#4f46e5">
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-6">Support & Community</h1>
        <div className="prose prose-invert max-w-none">
          <p>
            Community forums, support contacts, and SLA details. Access help articles, raise tickets, or join our community
            channels to collaborate with other users and engineers.
          </p>
        </div>
      </div>
    </Layout>
  );
}
