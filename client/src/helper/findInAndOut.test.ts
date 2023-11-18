import { findInAndOut } from "./findInAndOut";

describe("helper - findInAndOut", () => {
  it("can find the correct in and out on further range", () => {
    expect(findInAndOut([0, 5], [3, 8])).toEqual({
      in: [6, 7, 8],
      out: [0, 1, 2],
    });
  });

  it("can find the correct in and out on closer range", () => {
    expect(findInAndOut([3, 8], [0, 5])).toEqual({
      in: [0, 1, 2],
      out: [6, 7, 8],
    });
  });

  it("can find the correct out if the first range is bigger than newer one", () => {
    expect(findInAndOut([0, 8], [3, 5])).toEqual({
      in: [],
      out: [0, 1, 2, 6, 7, 8],
    });
  });

  it("can find the correct ins if the second range is bigger than older one", () => {
    expect(findInAndOut([3, 5], [0, 9])).toEqual({
      in: [0, 1, 2, 6, 7, 8, 9],
      out: [],
    });
  });

  it("can give nothing if both range are the same", () => {
    expect(findInAndOut([9999, 10005], [9999, 10005])).toEqual({
      in: [],
      out: [],
    });
  });
});
