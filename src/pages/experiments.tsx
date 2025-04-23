'use client';

import Head from 'next/head';
import {
  Header,
  MetricsPanel,
  VisualizationChartsPanel,
  EventLogPanel,
} from '@/app/components';

export default function Experiments() {
  return (
    <div className="min-h-screen bg-gray-100 evolvai-scrollbar">
      <Head>
        <title>Real-Time Experiment Monitoring</title>
        <meta name="description" content="Dashboard for monitoring A/B test experiments in real-time" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MetricsPanel />
        <VisualizationChartsPanel />
        <EventLogPanel />
      </main>
    </div>
  );
}
