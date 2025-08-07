export interface IntervalOption {
  value: number;
  label: string;
}

export const defaultIntervalOptions: IntervalOption[] = [
  { value: 7, label: '7 sessions' },
  { value: 15, label: '15 sessions' },
  { value: 30, label: '30 sessions' },
];

export const getDefaultIndex = (
  dataLength: number,
  interval: number = 7
): number => {
  const numCompleteIntervals = Math.floor(dataLength / interval);
  return Math.max(0, numCompleteIntervals - 1);
};
