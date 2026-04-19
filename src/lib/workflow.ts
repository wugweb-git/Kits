export async function sleep(duration: string): Promise<void> {
  const milliseconds = duration.endsWith('s') ? Number(duration.slice(0, -1)) * 1000 : Number(duration);
  await new Promise((resolve) => setTimeout(resolve, Number.isFinite(milliseconds) ? milliseconds : 0));
}
