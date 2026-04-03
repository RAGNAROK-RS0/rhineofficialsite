import React from 'react';
import Layout from '../../components/Layout';

export default function WebGPU3D() {
  return (
    <Layout themeColor="#4f46e5">
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-6">WebGPU / 3D Rendering</h1>
        <div className="prose prose-invert max-w-none">
          <p>
            Browser-based GPU rendering workflows and interactive 3D visualisations using WebGPU and optimized shader pipelines.
            We build performant scenes with attention to memory usage, GPU scheduling, and progressive loading for lower-end devices.
          </p>
          <p>
            Use cases include interactive product demos, data visualisation, and complex material rendering for web-native experiences.
          </p>
        </div>
      </div>
    </Layout>
  );
}
