const makeRange = n => Array.from({ length: n }, (x, i) => i + 1);

function create(n) {
  const range = makeRange(n);
  const fn = `(${range.map(n => `arg${n}: T${n}`).join(', ')}) => R`;
  return `
export function createSelector<${range
    .map(n => `T${n}`)
    .join(', ')}, R, S = DefaultState>(
  selectors: [
${range.map(n => `    Selector<S, T${n}>`).join(',\n')}
  ],
  fn: ${fn}
): OutputSelector<
  S,
  R,
  ${fn}
>`;
}

console.log(
  makeRange(12)
    .map(create)
    .join('\n\n')
);
