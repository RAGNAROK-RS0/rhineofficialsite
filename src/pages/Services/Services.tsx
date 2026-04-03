import React from 'react';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';

const items = [
  { title: 'Web Development', to: '/services/web-development' },
  { title: 'Cloud Infrastructure', to: '/services/cloud-infrastructure' },
  { title: 'IT Consulting', to: '/services/it-consulting' },
  { title: 'Digital Transformation', to: '/services/digital-transformation' },
];

export default function Services() {
  return (
    <Layout themeColor="#4f46e5" onLogoClick={() => window.location.href = '/'}>
      <div className="max-w-6xl mx-auto p-8 text-white">
        <h2 className="text-3xl font-bold mb-6">Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map(i => (
            <Link to={i.to} key={i.to} className="p-6 bg-white/5 rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold">{i.title}</h3>
              <p className="text-white/70 mt-2">Learn more about our {i.title} services.</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
