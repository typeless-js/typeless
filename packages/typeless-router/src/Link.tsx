import * as React from 'react';
import { useActions } from 'typeless';
import { RouterActions } from './module';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  //
}

export const Link = (props: LinkProps) => {
  const { href, onClick } = props;
  const { push } = useActions(RouterActions);
  return (
    <a
      {...props}
      onClick={e => {
        e.preventDefault();
        if (href) {
          push(href);
        }
        if (onClick) {
          onClick(e);
        }
      }}
    />
  );
};
