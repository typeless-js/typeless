const makeRange = n => Array.from({ length: n }, (x, i) => i + 1);

function create(n) {
  const range = makeRange(n);
  const fn = `(${range.map(n => `arg${n}: R${n}`).join(', ')}) => R`;
  return `
  createSelector<${range.map(n => `R${n}`).join(', ')}, R>(
${range.map(n => `    selector${n}: (state: TState) => R${n}`).join(',\n')},
    resultFunc: ${fn}
  ): OutputSelector<R, ${fn}>;
`;
}

console.log(
  makeRange(12)
    .map(create)
    .join('\n\n')
);
