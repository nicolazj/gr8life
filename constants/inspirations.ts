import { DIMENSIONS, type Dimension } from '@/convex/schema';

export interface Inspiration {
    title: string;
    description: string;
}

export const DIMENSION_INSPIRATIONS: Record<Dimension, Inspiration[]> = {
    [DIMENSIONS.TRANSACT]: [
        {
            title: 'Salary Negotiation',
            description: 'Learn the key phrases to use when asking for a raise or negotiating a starting salary.',
        },
        {
            title: 'Side Hustle Ideas',
            description: 'Explore 5 low-cost business ideas you can start this weekend to boost your income.',
        },
        {
            title: '50/30/20 Rule',
            description: 'Master the simple budgeting rule: 50% needs, 30% wants, and 20% savings.',
        },
    ],
    [DIMENSIONS.INVEST]: [
        {
            title: 'Power of Compounding',
            description: 'See how investing just $50 a month can grow into a significant nest egg over time.',
        },
        {
            title: 'Index Fund 101',
            description: 'Understand why low-cost index funds are often the best bet for long-term growth.',
        },
        {
            title: 'Real Estate Crowdfunding',
            description: 'Invest in premium real estate properties with as little as $500.',
        },
    ],
    [DIMENSIONS.ASSIST]: [
        {
            title: 'Become a Mentor',
            description: 'Share your expertise and help guide the next generation of leaders in your field.',
        },
        {
            title: 'Micro-Volunteering',
            description: 'Discover how you can make an impact in just 15 minutes a week from your phone.',
        },
        {
            title: 'Write Online',
            description: 'Start a blog or newsletter to share your knowledge and help others at scale.',
        },
    ],
    [DIMENSIONS.LEARN]: [
        {
            title: 'Speed Reading',
            description: 'Double your reading speed and retain more information with these simple techniques.',
        },
        {
            title: 'Learn a Language',
            description: 'The benefits of bilingualism and the best apps to get you conversational fast.',
        },
        {
            title: 'Online Courses',
            description: 'Top rated courses to upskill in data science, design, or management.',
        },
    ],
    [DIMENSIONS.HEALTH]: [
        {
            title: 'Health Integration',
            description: 'Combine walking data with daily step goal for automated tracking.',
        },
        {
            title: 'Sleep Hygiene',
            description: 'Create a pre-sleep routine that guarantees you wake up refreshed and ready.',
        },
        {
            title: 'Meditation 101',
            description: 'Simple breathing exercises to reduce stress and improve focus in 5 minutes.',
        },
    ],
    [DIMENSIONS.FAMILY]: [
        {
            title: 'Tech-Free Sundays',
            description: 'Dedicate one day a week to unplug and fully connect with your loved ones.',
        },
        {
            title: 'Weekly Dinner',
            description: 'Establish a recurring family meal where everyone shares their "highs and lows".',
        },
        {
            title: 'Date Night Ideas',
            description: 'Creative and affordable date night ideas to keep the spark alive.',
        },
    ],
    [DIMENSIONS.RELATIONSHIPS]: [
        {
            title: 'Reconnect',
            description: 'Reach out to an old friend you haven\'t spoken to in over a year.',
        },
        {
            title: 'Active Listening',
            description: 'Techniques to become a better listener and deepen your connections.',
        },
        {
            title: 'Networking Events',
            description: 'How to make meaningful connections at conferences and meetups without the awkwardness.',
        },
    ],
    [DIMENSIONS.EGO]: [
        {
            title: 'Gratitude Journal',
            description: 'Write down 3 things you are grateful for every morning to shift your mindset.',
        },
        {
            title: 'Personal Branding',
            description: 'Define your personal brand and how you want to be perceived by the world.',
        },
        {
            title: 'Mindfulness Checks',
            description: 'Set random reminders to pause, breathe, and center yourself throughout the day.',
        },
    ],
};
