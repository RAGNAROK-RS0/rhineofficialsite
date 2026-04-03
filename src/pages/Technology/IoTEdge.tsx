import React from 'react';
import Layout from '../../components/Layout';

export default function IoTEdge() {
  return (
    <Layout themeColor="#4f46e5">
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-6">IoT & Edge Computing</h1>
        <div className="prose prose-invert max-w-none">
          <p>
            Edge-native architectures for device management, secure telemetry, and low-latency processing. We design update
            strategies, secure boot flows, and telemetry pipelines that respect bandwidth constraints while providing reliable
            observability.
          </p>
          <p>
            Solutions include device lifecycle management, remote diagnostics, and secure OTA updates with integrity verification.
          </p>
        </div>
      </div>
    </Layout>
  );
}
