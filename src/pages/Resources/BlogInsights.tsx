import React from 'react';
import Layout from '../../components/Layout';

export default function BlogInsights() {
  return (
    <Layout themeColor="#4f46e5">
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-6">Blog / Insights</h1>
        <div className="prose prose-invert max-w-none">
          <p>Engineering and product posts on architecture, performance, and case studies. Learnings and deep dives from
          real projects and experiments.</p>
        </div>
      </div>
    </Layout>
  );
}
