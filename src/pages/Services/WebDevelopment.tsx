import React from 'react';
import Layout from '../../components/Layout';

export default function WebDevelopment() {
  return (
    <Layout themeColor="#4f46e5">
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-6">Web Development</h1>
        <div className="prose prose-invert max-w-none">
          <p>
            Custom web applications and progressive web apps built with modern frontend and backend stacks. We focus on
            scalable component architectures using React and TypeScript, strict typing and CI pipelines to ensure maintainability,
            and performance optimisations such as code-splitting, server-side rendering where appropriate, and critical-path
            rendering improvements to reduce Time-to-Interactive.
          </p>
          <p>
            Our engineering approach includes automated testing, measurable performance budgets, and observability hooks that
            allow teams to iterate quickly while keeping production reliability high. We design APIs and data contracts to be
            stable and versioned, minimising downstream breakage and enabling long-term evolution of your product.
          </p>
        </div>
      </div>
    </Layout>
  );
}
