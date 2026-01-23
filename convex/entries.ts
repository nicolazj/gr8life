import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

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
      .withIndex('by_userId_dimension', (q) =>
        q.eq('userId', user._id).eq('dimension', args.dimension)
      )
      .order('desc')
      .take(100);

    return entries;
  },
});

export const entryCompletion = query({
  args: {
    startTimestamp: v.number(),
  },
  handler: async (ctx, args) => {
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

    const entries = await ctx.db
      .query('entries')
      .withIndex('by_userId_createdAt', (q) =>
        q.eq('userId', user._id).gte('createdAt', args.startTimestamp)
      )
      .collect();

    const counts: Record<string, number> = {
      transact: 0,
      invest: 0,
      assist: 0,
      learn: 0,
      health: 0,
      family: 0,
      relationships: 0,
      ego: 0,
    };

    for (const entry of entries) {
      if (counts[entry.dimension] !== undefined) {
        counts[entry.dimension]++;
      }
    }

    return counts;
  },
});

export const getEntry = query({
  args: { entryId: v.id('entries') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const entry = await ctx.db.get(args.entryId);
    return entry;
  },
});

export const deleteEntry = mutation({
  args: { entryId: v.id('entries') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const entry = await ctx.db.get(args.entryId);
    if (!entry) throw new Error('Entry not found');

    // Verify ownership
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!user || user._id !== entry.userId) {
      throw new Error('Unauthorized');
    }

    await ctx.db.delete(args.entryId);
  },
});
