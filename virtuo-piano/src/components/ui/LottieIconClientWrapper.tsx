import LottieIcon from './LottieIcon';
import { forwardRef } from 'react';
import type { LottieIconHandle } from './LottieIcon';

export default forwardRef<
  LottieIconHandle,
  React.ComponentProps<typeof LottieIcon>
>(function Wrapper(props, ref) {
  return <LottieIcon ref={ref} {...props} />;
});
