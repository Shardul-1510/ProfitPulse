import React from 'react';
import { ThumbsUp } from 'lucide-react';
import { useFeedbackStore } from '../store/feedbackStore';

const FeedbackList = () => {
  const { feedbacks, toggleUpvote } = useFeedbackStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Recent Feedback</h2>
      </div>
      <div className="space-y-4">
        {feedbacks.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                    item.sentiment === 'neutral' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{item.text}</p>
                <p className="mt-1 text-sm text-gray-500">Category: {item.category}</p> {/* Display category */}
              </div>
              <button 
                onClick={() => toggleUpvote(item.id)}
                className={`flex items-center space-x-1 transition-colors ${
                  item.userUpvoted 
                    ? 'text-indigo-600' 
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span className="text-sm font-medium">{item.upvotes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;