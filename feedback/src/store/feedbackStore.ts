import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Feedback {
  id: number;
  text: string;
  category: string;
  sentiment: 'positive' | 'neutral' | 'critical';
  upvotes: number;
  date: string;
  userUpvoted?: boolean;
}

interface FeedbackState {
  feedbacks: Feedback[];
  addFeedback: (feedback: Omit<Feedback, 'id' | 'date' | 'upvotes'>) => void;
  toggleUpvote: (id: number) => void;
  getFeedbackStats: () => {
    totalFeedbacks: number;
    categoryCount: Record<string, number>;
    sentimentDistribution: Record<string, number>;
  };
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set, get) => ({
      feedbacks: [
        {
          id: 1,
          text: "The profit predictions are helping us make better decisions",
          sentiment: "positive",
          category: "accuracy",
          upvotes: 24,
          date: new Date().toISOString(),
        },
        {
          id: 2,
          text: "Would be great to have more detailed analysis options",
          sentiment: "neutral",
          category: "feature",
          upvotes: 18,
          date: new Date().toISOString(),
        },
        {
          id: 3,
          text: "Some edge cases need improvement in predictions",
          sentiment: "critical",
          category: "accuracy",
          upvotes: 15,
          date: new Date().toISOString(),
        },
      ],
      addFeedback: (feedback) =>
        set((state) => ({
          feedbacks: [
            ...state.feedbacks,
            {
              ...feedback,
              id: Date.now(),
              date: new Date().toISOString(),
              upvotes: 0,
            },
          ],
        })),
      toggleUpvote: (id) =>
        set((state) => ({
          feedbacks: state.feedbacks.map((f) =>
            f.id === id
              ? {
                  ...f,
                  upvotes: f.userUpvoted ? f.upvotes - 1 : f.upvotes + 1,
                  userUpvoted: !f.userUpvoted,
                }
              : f
          ),
        })),
      getFeedbackStats: () => {
        const feedbacks = get().feedbacks;
        const stats = {
          totalFeedbacks: feedbacks.length,
          categoryCount: {} as Record<string, number>,
          sentimentDistribution: {} as Record<string, number>,
        };

        feedbacks.forEach((feedback) => {
          stats.categoryCount[feedback.category] = (stats.categoryCount[feedback.category] || 0) + 1;
          stats.sentimentDistribution[feedback.sentiment] = (stats.sentimentDistribution[feedback.sentiment] || 0) + 1;
        });

        return stats;
      },
    }),
    {
      name: 'feedback-storage',
    }
  )
);