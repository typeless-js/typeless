import * as React from 'react';

let isHmr = false;

export const getIsHmr = () => isHmr;

export const startHmr = () => {
  if (!isHmr) {
    isHmr = true;
    if (process.env.NODE_ENV === 'development') {
      // tslint:disable-next-line:no-console
      console.log('HMR Starting...');
    }
  }
};

export const stopHmr = () => {
  if (isHmr) {
    isHmr = false;
    if (process.env.NODE_ENV === 'development') {
      // tslint:disable-next-line:no-console
      console.log('HMR Done');
    }
  }
};

export function Hmr({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    setTimeout(() => {
      stopHmr();
    });
  }, []);
  return <>{children}</>;
}
