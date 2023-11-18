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
  const ins = [];
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
  const findIn1 = oldStart - newStart;
  if (findIn1 > 0) {
    for (let i = newStart; i < oldStart; i++) {
      ins.push(i);
    }
  }
  const findIn2 = newFinish - oldFinish;
  if (findIn2 > 0) {
    for (let i = oldFinish + 1; i <= newFinish; i++) {
      ins.push(i);
    }
  }
  return { in: ins, out };
}
