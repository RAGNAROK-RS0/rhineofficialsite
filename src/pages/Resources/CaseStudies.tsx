import React from 'react';
import Layout from '../../components/Layout';

export default function CaseStudies() {
  return (
    <Layout themeColor="#4f46e5">
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-6">Case Studies</h1>
        <div className="prose prose-invert max-w-none">
          <p>
            Documented client engagements showing measurable outcomes, architecture patterns, and lessons learned. Case
            studies present the problem, the technical approach, and quantified results to help stakeholders evaluate fit.
          </p>
          <p>
            Where applicable, architecture diagrams and cost breakdowns are provided to make trade-offs explicit.
          </p>
        </div>
      </div>
    </Layout>
  );
}
