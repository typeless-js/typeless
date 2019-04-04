let isHmr = false;

export const getIsHmr = () => isHmr;

export const onHmr = (fn: (...args: any[]) => any) => {
  isHmr = true;
  fn();
  setTimeout(() => {
    isHmr = false;
  });
};
