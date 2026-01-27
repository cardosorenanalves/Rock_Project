export const abbreviateMiddle = (
  s: string,
  start: number = 8,
  end: number = 8,
  threshold: number = 24
) => {
  const len = s.length;
  const minLen = Math.max(start + end + 3, threshold);
  if (len <= minLen) return s;
  return `${s.slice(0, start)}…${s.slice(-end)}`;
};
