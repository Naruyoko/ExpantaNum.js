const ExpantaNum = require("./ExpantaNum");

describe("fromString", () => {
  it("should parse exponent", () => {
    expect(ExpantaNum.fromString("1.867e14").array).toEqual([
      [0, 186700000000000],
    ]);
  });

  it("should parse ee prefix", () => {
    expect(ExpantaNum.fromString("ee2.948e52").array).toEqual([
      [0, 52.469527479187015],
      [1, 3],
    ]);
  });

  it("should parse G prefix", () => {
    expect(ExpantaNum.fromString("G1000000").array).toEqual([
      [0, 10000000000],
      [1, 8],
      [2, 999998],
    ]);
  });

  it("should parse Ge prefix", () => {
    expect(ExpantaNum.fromString("Ge1.025e52").array).toEqual([
      [0, 52.66274946625142],
    ]);
  });

  it("should parse J prefix", () => {
    expect(ExpantaNum.fromString("J4.999e15").array).toEqual([
      [499999999999, 1],
    ]);
  });
});
