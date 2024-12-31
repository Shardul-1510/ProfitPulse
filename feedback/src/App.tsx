import React, { useEffect, useState } from 'react';
import { MessageSquare, TrendingUp, PieChart } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import InsightsDashboard from './components/InsightsDashboard';
import axios from 'axios';

interface User {
  uname: string;
  fname: string;
  lname: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('feedback');
  const [user, setUser ] = useState<User | null>(null); // State to hold user data


  useEffect(() => {
  
  
    const checkUsername = async () => {
      try {
        const response = await axios.get('http://localhost:4000/getusername');
        if (response.data == '') {
          window.open('http://localhost:5173/', '_self');
        }
        else {
          setUser(response.data);
        }
        
      } catch (error) {
        console.error('Error checking username:', error);
      }
    };
  
    checkUsername();
  },);
  

  const handleLogout = async () => {
    try {
      
      await axios.post('http://localhost:4000/logout');
      setUser(null);
      window.location.href = 'http://localhost:5173/';
      
    } catch (error) {
      console.error('Logout error:', error);
      // Optionally, you can show an error message to the user
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Toaster position="top-right" />
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ProfitPulse Insights Hub</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('feedback')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'feedback'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Feedback</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'insights'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <PieChart className="h-4 w-4" />
                  <span>Insights</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'feedback' ? (
              <>
                <FeedbackForm />
                <div className="mt-8">
                  <FeedbackList />
                </div>
              </>
            ) : (
              <InsightsDashboard />
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Performance</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">Neural Network</span>
                    <span className="text-sm font-bold text-blue-800">92% Accuracy</span>
                  </div>
                  <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 rounded-full h-2" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">Linear Regression</span>
                    <span className="text-sm font-bold text-green-800">83% Accuracy</span>
                  </div>
                  <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                    <div className="bg-green-600 rounded-full h-2" style={{ width: '83%' }}></div>
                  </div>
                </div>
              </div>              
            </div>
            {/* Conditional rendering based on user state */}
            {user ? (
              <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Welcome, {user.fname} {user.lname}!</h3>
                <p className="text-gray-600">You are logged in.</p>
                <br></br>
                <button 
                  onClick={handleLogout} 
                  className="w-full flex justify-center items-center space-x-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Welcome!</h3>
                <p className="text-gray-600">Please log in to access more features.</p>
                
              </div>
              
            )}
            <br></br>
            
          </div>
        </div>
      </main>

    </div>
  );
}

export default App;