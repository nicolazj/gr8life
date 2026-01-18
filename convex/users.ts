import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const updateOrCreateUser = mutation({
  args: {
    clerkUser: v.object({
      id: v.string(),
      email: v.string(),
      name: v.string(),
      image_url: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const { clerkUser } = args;

    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkUser.id))
      .first();


    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        email: clerkUser.email,
        name: clerkUser.name,
        imageUrl: clerkUser.image_url,
      });
      return existingUser._id;
    } else {
      return await ctx.db.insert('users', {
        clerkId: clerkUser.id,
        email: clerkUser.email,
        name: clerkUser.name,
        imageUrl: clerkUser.image_url,
      });
    }
  },
});

export const deleteUser = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.id))
      .first();

    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});

export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();

    return user;
  },
});
