import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { useFeedbackStore } from '../store/feedbackStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReactDOM from 'react-dom';

const InsightsDashboard = () => {
  const { feedbacks, getFeedbackStats } = useFeedbackStore();
  const stats = getFeedbackStats();
  const [showGraph, setShowGraph] = useState(false);
  const [graphWindow, setGraphWindow] = useState<Window | null>(null);

  const topFeedbacks = [...feedbacks]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 4);

  const calculatePercentage = (count: number) => 
    ((count / stats.totalFeedbacks) * 100).toFixed(0);

  const handleShowGraph = () => {
    setShowGraph(!showGraph);
    if (showGraph && graphWindow) {
      graphWindow.close();
      setGraphWindow(null);
    } 
    else{
      const newGraphWindow = window.open('', 'GraphWindow', 'width=800,height=400');
      newGraphWindow.document.write('<html><head><title>Graph</title></head><body>');
      newGraphWindow.document.write('<div id="graph"></div>');
      newGraphWindow.document.write('</body></html>');

      setTimeout(() => {
        const graphContainer =  newGraphWindow?.document.getElementById('graph');
        const graphRoot = document.createElement('div');
        graphContainer.appendChild(graphRoot);

        const GraphComponent = () => (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(stats.sentimentDistribution).map(([sentiment, count]) => ({ sentiment, count }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sentiment" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

        ReactDOM.render(<GraphComponent />, graphRoot);
      }, 100);
      setGraphWindow(newGraphWindow);
    }
    setShowGraph(!showGraph);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Feedback Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sentiment Distribution</h3>
            <button
              onClick={handleShowGraph}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {showGraph ? 'Hide Graph' : 'Show Graph'}
            </button>
          </div>
          <div className="flex items-center justify-around p-4">
            {['positive', 'neutral', 'critical'].map((sentiment) => (
              <div key={sentiment} className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                  sentiment === 'positive' ? 'bg-green-100' :
                  sentiment === 'neutral' ? 'bg-yellow-100' :
                  'bg-red-100'
                }`}>
                  <span className={`text-xl font-bold ${
                    sentiment === 'positive' ? 'text-green-600' :
                    sentiment === 'neutral' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {calculatePercentage(stats.sentimentDistribution[sentiment] || 0)}%
                  </span>
                </div>
                <span className="text-sm text-gray-600 capitalize">{sentiment}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
          <div className="space-y-4">
            {Object.entries(stats.categoryCount).map(([category, count]) => (
              <div key={category} className="group relative">
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{category}</span>
                  <span className="font-medium">{calculatePercentage(count)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 rounded-full h-2" 
                    style={{ width: `${calculatePercentage(count)}%` }}
                  />
                </div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  {count} feedbacks
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Upvoted Feedback</h3>
        <div className="space-y-4">
          {topFeedbacks.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{item.text}</p>
              <div className="flex items-center space-x-2 text-indigo-600">
                <TrendingUp className="h-4 w-4" />
                <span className="font-bold">{item.upvotes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightsDashboard;