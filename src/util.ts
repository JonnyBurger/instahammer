export const wait = (ms: number) =>
  new Promise(resolve => setTimeout(() => resolve('timed-out'), ms))
