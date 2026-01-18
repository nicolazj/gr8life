import { WebhookEvent } from '@clerk/nextjs/server';
import { httpRouter } from 'convex/server';
import { Webhook } from 'svix';
import { api } from './_generated/api';
import { httpAction } from './_generated/server';

const http = httpRouter();

http.route({
  path: '/clerk-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Missing CLERK_WEBHOOK_SECRET');
      return new Response('Webhook secret not configured', { status: 500 });
    }

    const svixId = request.headers.get('svix-id');
    const svixTimestamp = request.headers.get('svix-timestamp');
    const svixSignature = request.headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('Missing Svix headers');
      return new Response('Error occurred -- no svix headers', { status: 400 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);

    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Error verifying webhook', { status: 400 });
    }

    const eventType = evt.type;



    if (eventType === 'user.created' || eventType === 'user.updated') {
      const clerkUser = evt.data;

      const primaryEmail = clerkUser.email_addresses.find(
        (ea) => ea.verification?.status === 'verified'
      )?.email_address;

      if (!primaryEmail) {
        throw new Error('User has no verified email');
      }
      const name = [clerkUser.first_name, clerkUser.last_name]
        .filter(Boolean)
        .join(' ');

      const user = {
        id: clerkUser.id,
        email: primaryEmail,
        name: name,
        image_url: clerkUser.image_url,
      }
      await ctx.runMutation(api.users.updateOrCreateUser, {
        clerkUser: user
      });
    } else if (eventType === 'user.deleted') {
      const id = (evt.data).id;
      if (id) {
        await ctx.runMutation(api.users.deleteUser, { id });
      }
    } else {
      console.log('Ignored Clerk webhook event:', eventType);
    }

    return new Response(null, { status: 200 });
  }),
});

export default http;
