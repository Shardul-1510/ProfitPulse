import React from 'react';
import { BrainCircuit, LineChart, Database, Building2 } from 'lucide-react';

export default function Features() {
  const features = [
    {
      name: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your business data to generate accurate profit predictions.',
      icon: BrainCircuit,
    },
    {
      name: 'Future Forecasting',
      description: 'Get instant predictions and updates as your business data changes throughout the day.',
      icon: LineChart,
    },
    {
      name: 'Data Integration',
      description: 'Seamlessly connect with your existing business tools and databases for comprehensive analysis.',
      icon: Database,
    },
    {
      name: 'Industry Insights',
      description: 'Compare your performance against industry benchmarks and discover growth opportunities.',
      icon: Building2,
    },
  ];

  return (
    <section id="features" className="section">
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Powerful Features for Smart Predictions
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
            Everything you need to transform your business data into actionable insights.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-16">
                  <h3 className="text-xl font-medium text-slate-900">{feature.name}</h3>
                  <p className="mt-2 text-base text-slate-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}