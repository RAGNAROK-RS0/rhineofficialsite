import React from 'react';
import Layout from '../../components/Layout';

export default function AIAutomation() {
  return (
    <Layout themeColor="#4f46e5">
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-6">AI & Automation</h1>
        <div className="prose prose-invert max-w-none">
          <p>
            Deployable machine learning pipelines, feature stores, and end-to-end automation that reduces manual effort and
            accelerates decision-making. We build reproducible training pipelines, CI-driven model deployment, and monitoring
            that includes drift detection and automated rollback strategies.
          </p>
          <p>
            Focused on operationalising ML, our solutions emphasise explainability, cost-efficient inference, and integration with
            existing data platforms while ensuring access control and auditability for regulated environments.
          </p>
        </div>
      </div>
    </Layout>
  );
}
