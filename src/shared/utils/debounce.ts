import { type AnyFunction } from '@/shared/types';

export function debounce<T extends AnyFunction>(cb: T, delay: number) {
  let timerID: number;

  return function debounced(...args: Parameters<T>) {
    if (timerID) {
      clearTimeout(timerID);
    }
    timerID = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}
