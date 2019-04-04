import { withBatch } from '../src/withBatch';
import { batchUpdate } from '../src/actions';

test('process batchUpdate', () => {
  const reducer = withBatch((state: number = 0, action) => {
    return state + 1;
  });

  const newState = reducer(
    undefined,
    batchUpdate([{ type: 'a' }, { type: 'b' }])
  );
  expect(newState).toEqual(2);
});
