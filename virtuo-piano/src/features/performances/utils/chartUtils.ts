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

export const sliceDataByInterval = <T>(
  data: T[],
  index: number,
  interval: number
): T[] => {
  const totalIntervals = Math.ceil(data.length / interval);
  const reverseIndex = totalIntervals - 1 - index;
  const endIndex = data.length - reverseIndex * interval;
  const startIndex = Math.max(0, endIndex - interval);
  return data.slice(startIndex, endIndex);
};

export const calculateAverage = (data: any[], key: string): number => {
  const sum = data.reduce((acc, item) => acc + item[key], 0);
  return Math.round(sum / data.length);
};

export const calculateAverageFixed = (
  data: any[],
  key: string,
  decimals: number = 2
): number => {
  const sum = data.reduce((acc, item) => acc + item[key], 0);
  return Number((sum / data.length).toFixed(decimals));
};
