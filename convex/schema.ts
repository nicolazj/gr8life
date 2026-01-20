import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const DIMENSIONS = {
  TRANSACT: 'transact',
  INVEST: 'invest',
  ASSIST: 'assist',
  LEARN: 'learn',
  HEALTH: 'health',
  FAMILY: 'family',
  RELATIONSHIPS: 'relationships',
  EGO: 'ego',
} as const;

export type Dimension = (typeof DIMENSIONS)[keyof typeof DIMENSIONS];

export const DIMENSION_CONFIG: Record<Dimension, { name: string; color: string; description: string; icon: string }> = {
  [DIMENSIONS.TRANSACT]: {
    name: 'Transact',
    color: '#2D9CDB',
    description: 'Maintaining stable income through jobs or advisory work to support yourself and your family financially.',
    icon: 'dollarsign.circle.fill',
  },
  [DIMENSIONS.INVEST]: {
    name: 'Invest',
    color: '#30837D',
    description: 'Putting time, money, or effort into activities that will grow and compound in value over time.',
    icon: 'chart.line.uptrend.xyaxis',
  },
  [DIMENSIONS.ASSIST]: {
    name: 'Assist',
    color: '#F5A623',
    description: 'Intentionally helping people through mentoring, feedback, writing, or other forms of support.',
    icon: 'hand.raised.fill',
  },
  [DIMENSIONS.LEARN]: {
    name: 'Learn',
    color: '#8B5CF6',
    description: 'Actively learning new skills and knowledge needed to improve your output and stay relevant.',
    icon: 'book.fill',
  },
  [DIMENSIONS.HEALTH]: {
    name: 'Health',
    color: '#EB5757',
    description: 'Maintaining physical and mental health through exercise, meditation, and constant wellness experimentation.',
    icon: 'figure.run',
  },
  [DIMENSIONS.FAMILY]: {
    name: 'Family',
    color: '#F5A623',
    description: 'Being purposeful about carving out meaningful time with your partner and children.',
    icon: 'figure.2.and.child.holdinghands',
  },
  [DIMENSIONS.RELATIONSHIPS]: {
    name: 'Relationships',
    color: '#E91E63',
    description: 'Consciously investing effort in building and maintaining relationships with interesting people.',
    icon: 'heart.fill',
  },
  [DIMENSIONS.EGO]: {
    name: 'Ego / Self',
    color: '#30837D',
    description: 'Creating micro-moments of happiness through gratitude practices and activities that bring you joy.',
    icon: 'person.crop.circle',
  },
};

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  })
    .index('by_clerkId', ['clerkId'])
    .index('by_email', ['email']),

  entries: defineTable({
    userId: v.id('users'),
    dimension: v.string(),
    content: v.string(),
    createdAt: v.number(),
  })
    .index('by_userId_dimension', ['userId', 'dimension'])
    .index('by_userId_createdAt', ['userId', 'createdAt']),
});
