const makeRange = n => Array.from({ length: n }, (x, i) => i + 1);

function create(n) {
  const range = makeRange(n);
  const fn = `(${range.map(n => `arg${n}: R${n}`).join(', ')}) => R`;
  return `
export function createSelector<${range.map(n => `S${n}, R${n}`).join(', ')}, R>(
  ${range
    .map(
      n => `  selector${n}:  Selector<R${n}, any> | InputSelector<S${n}, R${n}>`
    )
    .join(',\n')},
  fn: ${fn} 
): Selector<
  R,
  ${fn}
>`;
}

console.log(
  makeRange(12)
    .map(create)
    .join('\n\n')
);
