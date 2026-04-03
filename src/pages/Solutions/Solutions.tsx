import React from 'react';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';

const items = [
  { title: 'Enterprise Software', to: '/solutions/enterprise-software' },
  { title: 'AI & Automation', to: '/solutions/ai-automation' },
  { title: 'Cybersecurity Suite', to: '/solutions/cybersecurity-suite' },
  { title: 'Data Analytics', to: '/solutions/data-analytics' },
];

export default function Solutions() {
  return (
    <Layout themeColor="#4f46e5">
      <div className="max-w-6xl mx-auto p-8 text-white">
        <h2 className="text-3xl font-bold mb-6">Solutions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map(i => (
            <Link to={i.to} key={i.to} className="p-6 bg-white/5 rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold">{i.title}</h3>
              <p className="text-white/70 mt-2">{i.title} to accelerate delivery and reduce operational risk.</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
