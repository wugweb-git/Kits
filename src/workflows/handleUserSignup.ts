import { sleep } from 'workflow';

async function createUser(email: string) {
  return { id: `user_${email.replace(/[^a-z0-9]/gi, '').toLowerCase()}` };
}

async function sendWelcomeEmail(_user: { id: string }) {
  return;
}

async function sendOnboardingEmail(_user: { id: string }) {
  return;
}

export async function handleUserSignup(email: string) {
  'use workflow';

  const user = await createUser(email);
  await sendWelcomeEmail(user);

  await sleep('5s');

  await sendOnboardingEmail(user);
  return { userId: user.id, status: 'onboarded' };
}
