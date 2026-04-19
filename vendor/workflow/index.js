export async function sleep(duration) {
  const value = typeof duration === 'string' && duration.endsWith('s')
    ? Number(duration.slice(0, -1)) * 1000
    : Number(duration);

  await new Promise((resolve) => setTimeout(resolve, Number.isFinite(value) ? value : 0));
}
