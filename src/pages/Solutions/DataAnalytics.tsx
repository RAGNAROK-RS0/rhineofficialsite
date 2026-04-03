import React from 'react';
import Layout from '../../components/Layout';

export default function DataAnalytics() {
  return (
    <Layout themeColor="#4f46e5">
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-6">Data Analytics</h1>
        <div className="prose prose-invert max-w-none">
          <p>
            Data platforms for reporting, feature engineering stores, and self-service analytics. We design pipelines for
            reliable ETL, near-real-time streaming, and aggregated views that power dashboards and ML models.
          </p>
          <p>
            Emphasis is placed on data lineage, governance, and performance to ensure trust in insights and to support
            reproducible analyses across teams.
          </p>
        </div>
      </div>
    </Layout>
  );
}
