import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import type { Dimension } from './schema';

export const createEntry = mutation({
  args: {
    dimension: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    const now = Date.now();

    await ctx.db.insert('entries', {
      userId: user._id,
      dimension: args.dimension,
      content: args.content,
      createdAt: now,
    });

    return now;
  },
});

export const entriesByDimension = query({
  args: {
    dimension: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      return [];
    }

    const entries = await ctx.db
      .query('entries')
      .filter((q) => {
        const userIdFilter = q.eq('userId', user._id);
        const dimensionFilter = q.eq('dimension', args.dimension);
        return userIdFilter && dimensionFilter;
      })
      .order('desc', 'createdAt')
      .take(100);

    return entries;
  },
});

export const weeklyCompletion = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      return null;
    }

    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const entries = await ctx.db
      .query('entries')
      .filter((q) => {
        const userIdFilter = q.eq('userId', user._id);
        const createdAtFilter = q.gte('createdAt', oneWeekAgo);
        return userIdFilter && createdAtFilter;
      })
      .collect();

    const completion: Record<string, boolean> = {
      transact: false,
      invest: false,
      assist: false,
      learn: false,
      health: false,
      family: false,
      relationships: false,
      ego: false,
    };

    for (const entry of entries) {
      if (completion[entry.dimension] === false) {
        completion[entry.dimension] = true;
      }
    }

    return completion;
  },
});
