import React from 'react';
import Layout from '../../components/Layout';

export default function BlockchainWeb3() {
  return (
    <Layout themeColor="#4f46e5">
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-6">Blockchain / Web3</h1>
        <div className="prose prose-invert max-w-none">
          <p>
            Smart contracts, permissioning models, and secure on-chain integrations. We design audit-friendly contract
            architectures and rigorous CI to reduce the risk of costly vulnerabilities.
          </p>
          <p>
            Integrations include secure key management, off-chain oracles, and interoperability layers for hybrid enterprise
            workflows.
          </p>
        </div>
      </div>
    </Layout>
  );
}
