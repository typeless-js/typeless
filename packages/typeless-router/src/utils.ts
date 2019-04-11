import { HistoryType, LocationChange } from './types';

export function ensureHTML5History() {
  if (!window.history) {
    throw new Error(
      'window.history is undefined. HTML5 history must be supported in this browser.'
    );
  }
}

function normalizeQuery(str: string) {
  if (str[0] !== '?') {
    str = '?' + str;
  }
  return str;
}

function fixLeadingSlash(str: string) {
  if (str[0] !== '/') {
    str = '/' + str;
  }
  return str;
}

export function getFullURL(historyType: HistoryType, location: LocationChange) {
  const url =
    typeof location === 'string'
      ? location
      : fixLeadingSlash(
          location.pathname +
            (location.search ? normalizeQuery(location.search) : '')
        );
  switch (historyType) {
    case 'hash': {
      const base = window.location.pathname + window.location.search;
      return base + '#' + url;
    }
    case 'browser': {
      return url;
    }
  }
}

export function getLocationChangeProps(location: LocationChange) {
  if (typeof location === 'string') {
    return {
      pathname: location,
      search: '',
    };
  }
  return {
    pathname: location.pathname,
    search: location.search || '',
  };
}

export function getLocationProps(historyType: HistoryType) {
  switch (historyType) {
    case 'hash': {
      const [pathname, search] = window.location.hash
        .replace(/^\#/, '')
        .split('?');
      return {
        pathname,
        search: search ? `?${search}` : '',
      };
    }
    case 'browser':
      return {
        pathname: window.location.pathname,
        search: window.location.search,
      };
  }
}
