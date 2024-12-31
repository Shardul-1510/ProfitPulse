import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useFeedbackStore } from '../store/feedbackStore';
import toast from 'react-hot-toast';

const FeedbackForm = () => {
  const addFeedback = useFeedbackStore((state) => state.addFeedback);
  const [formData, setFormData] = useState({
    feedback: '',
    category: '',
    email: '',

  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.feedback || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.email && !validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

  

    try {
      // Send to your backend
      const response = await fetch('http://localhost:3000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit feedback');
      const responseData = await response.json();
      // Add to local store
      addFeedback({
        text: formData.feedback,
        category: formData.category,
        sentiment: responseData.sentiment, //formData., // Initial sentiment, your backend should analyze and update this
      });
      console.log(responseData);

      toast.success('Feedback submitted successfully!');
      setFormData({ feedback: '', category: '', email: ''});

    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    }
  };

  return (
    
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Feedback</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select a category</option>
            <option value="accuracy">Accuracy Issue</option>
            <option value="feature">Feature Request</option>
            <option value="bug">Bug Report</option>
          </select>
        </div>
        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
            Your Feedback <span className="text-red-500">*</span>
          </label>
          <textarea
            id="feedback"
            rows={4}
            value={formData.feedback}
            onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Share your thoughts..."
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email (for notification updates)
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="your@email.com"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center items-center space-x-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Send className="h-4 w-4" />
          <span>Submit Feedback</span>
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;