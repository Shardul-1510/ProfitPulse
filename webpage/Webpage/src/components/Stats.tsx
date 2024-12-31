import React from 'react';

export default function Stats() {
  return (
    <section id="about" className="section">
    <div className="bg-indigo-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Trusted by businesses worldwide
          </h2>
          <p className="mt-3 text-xl text-indigo-200">
            Our AI-powered predictions help companies make better decisions
          </p>
        </div>
        <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
          <div className="flex flex-col">
            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">
              Accuracy Rate
            </dt>
            <dd className="order-1 text-5xl font-extrabold text-white">95%</dd>
          </div>
          <div className="flex flex-col mt-10 sm:mt-0">
            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">
              Predictions Made
            </dt>
            <dd className="order-1 text-5xl font-extrabold text-white">100+</dd>
          </div>
          <div className="flex flex-col mt-10 sm:mt-0">
            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">
              Client Success
            </dt>
            <dd className="order-1 text-5xl font-extrabold text-white">90%</dd>
          </div>
        </dl>
      </div>
    </div>
    </section>
  );
}