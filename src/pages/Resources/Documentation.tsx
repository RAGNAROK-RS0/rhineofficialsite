import React from 'react';
import Layout from '../../components/Layout';

export default function Documentation() {
  return (
    <Layout themeColor="#4f46e5">
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-6">Documentation</h1>
        <div className="prose prose-invert max-w-none">
          <p>
            Technical documentation, API references, and onboarding guides for implementers. Documentation is structured
            for both integrators and product teams, with examples, SDK references, and practical runbooks.
          </p>
          <p>
            We keep docs versioned alongside code and expose changelogs to make upgrades predictable.
          </p>
        </div>
      </div>
    </Layout>
  );
}
