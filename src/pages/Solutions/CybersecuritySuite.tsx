import React from 'react';
import Layout from '../../components/Layout';

export default function CybersecuritySuite() {
  return (
    <Layout themeColor="#4f46e5">
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-6">Cybersecurity Suite</h1>
        <div className="prose prose-invert max-w-none">
          <p>
            Holistic security controls covering identity, platform hardening, continuous threat detection, and incident response.
            We integrate SIEM, endpoint detection, and runtime protection to reduce mean-time-to-detection and mean-time-to-remediation.
          </p>
          <p>
            Our approach emphasizes least-privilege, zero-trust network design, and automated playbooks to contain and recover
            from incidents while maintaining business continuity.
          </p>
        </div>
      </div>
    </Layout>
  );
}
