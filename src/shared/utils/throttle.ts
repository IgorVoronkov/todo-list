import { type AnyFunction, type Nullable } from '@/shared/types';

type Options = {
  leading?: boolean;
  trailing?: boolean;
};

export function throttle<T extends AnyFunction>(
  cb: T,
  delay: number,
  { leading, trailing }: Options = { leading: true, trailing: false },
) {
  let lastCall: Nullable<number> = null;
  let timeoutId: Nullable<number> = null;
  let lastArgs: Parameters<T>;

  return function throttled(
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ) {
    const now = Date.now();
    lastArgs = args;

    const cancel = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const flush = () => {
      lastCall = Date.now();
      cb.apply(this, lastArgs);
      cancel();
    };

    if (lastCall === null) {
      if (leading === true) {
        flush();
      } else if (timeoutId === null) {
        timeoutId = setTimeout(flush, delay);
      }
      return;
    }

    if (now - lastCall >= delay) {
      flush();
      return;
    }

    if (timeoutId === null && trailing === true) {
      timeoutId = setTimeout(flush, delay - (now - lastCall));
    }
  };
}
