/**
 * Given two arrays that represents a range, find the elements that are in and out of the range.
 * @example
 * // const old = [0, 5]
 * // const newVal = [3, 8]
 * // returns { in: [6, 7, 8], out: [0, 1, 2] }
 */
export function findInAndOut(
  old: [number, number],
  newVal: [number, number],
): { in: number[]; out: number[] } {
  const out = [];
  const oldStart = old[0];
  const oldFinish = old[1];
  const newStart = newVal[0];
  const newFinish = newVal[1];

  const findOut1 = newStart - oldStart;
  if (findOut1 > 0) {
    for (let i = oldStart; i < newStart; i++) {
      out.push(i);
    }
  }
  const findOut2 = oldFinish - newFinish;
  if (findOut2 > 0) {
    for (let i = newFinish + 1; i <= oldFinish; i++) {
      out.push(i);
    }
  }

  // The ins are basically the new range
  const ins = Array.from(
    { length: newVal[1] - newVal[0] + 1 },
    (_, i) => i + newVal[0],
  );

  return { in: ins, out };
}
