import React from 'react';
import Layout from '../../components/Layout';

export default function CustomAPIs() {
  return (
    <Layout themeColor="#4f46e5">
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-6">Custom APIs</h1>
        <div className="prose prose-invert max-w-none">
          <p>
            Designing secure, versioned APIs with best-practice authentication, rate limiting, and clear versioning policies.
            We recommend OpenAPI-compliant contracts, automated contract tests, and staged rollout strategies for breaking changes.
          </p>
          <p>
            Emphasis on robust error handling, observability, and schema validation to prevent invalid data and reduce debugging time.
          </p>
        </div>
      </div>
    </Layout>
  );
}
