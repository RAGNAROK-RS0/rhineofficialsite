import React from 'react';
import Layout from '../../components/Layout';

export default function ITConsulting() {
  return (
    <Layout themeColor="#4f46e5">
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-6">IT Consulting</h1>
        <div className="prose prose-invert max-w-none">
          <p>
            Enterprise technology strategy, vendor evaluation, and delivery governance. We align engineering roadmaps with
            business objectives and provide pragmatic vendor selection and integration guidance.
          </p>
          <p>
            Our consultants emphasise measurable KPIs, governance frameworks, and cross-functional delivery processes to ensure
            predictable outcomes.
          </p>
        </div>
      </div>
    </Layout>
  );
}
