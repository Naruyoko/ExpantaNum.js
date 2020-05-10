# ![ExpantaNum.js](https://raw.githubusercontent.com/Naruyoko/ExpantaNum.js/non-code/ExpantaNumJS.png) ![α](https://raw.githubusercontent.com/Naruyoko/ExpantaNum.js/non-code/alpha.png) ![1](https://raw.githubusercontent.com/Naruyoko/ExpantaNum.js/non-code/1.png) ![.](https://raw.githubusercontent.com/Naruyoko/ExpantaNum.js/non-code/dot.png) ![3](https://raw.githubusercontent.com/Naruyoko/ExpantaNum.js/non-code/3.png) ![.](https://raw.githubusercontent.com/Naruyoko/ExpantaNum.js/non-code/dot.png) ![1](https://raw.githubusercontent.com/Naruyoko/ExpantaNum.js/non-code/1.png)
[![NPM](https://img.shields.io/npm/v/expanta_num.js.svg)](https://www.npmjs.com/package/expanta_num.js)
A huge number library holding up to {10,9e15,1,2}.

This reaches level f<sub>ω+1</sub>, which the operation [expansion](https://googology.wikia.org/wiki/Expansion) also is at, hence the name.

Internally, it is represented as an sign, array, and layer. Sign is 1 or -1. Array is \[\[a<sub>0</sub>,b<sub>0</sub>],\[a<sub>1</sub>,b<sub>1</sub>],\[a<sub>2</sub>,b<sub>2</sub>],\[a<sub>3</sub>,b<sub>3</sub>],...]. Layer is a non-negative integer. They together represents sign\*J<sup>layer</sup>topLayer, where Jx is 10{x}10 (PsiCubed2's Letter notation), and topLayer is:

* (...(10↑<sup>a<sub>3</sub></sup>)<sup>b<sub>3</sub></sup>(10↑<sup>a<sub>2</sub></sup>)<sup>b<sub>2</sub></sup>(10↑<sup>a<sub>1</sub></sup>)<sup>b<sub>1</sub></sup>b<sub>0</sub>) if a<sup>0</sup>=0.
* (...(10↑<sup>a<sub>3</sub></sup>)<sup>b<sub>3</sub></sup>(10↑<sup>a<sub>2</sub></sup>)<sup>b<sub>2</sub></sup>(10↑<sup>a<sub>1</sub></sup>)<sup>b<sub>1</sub></sup>(10↑<sup>a<sub>0</sub></sup>)<sup>b<sub>0</sub></sup>10) otherwise.

For detailed explanation and documentation, [see here](https://naruyoko.github.io/ExpantaNum.js/index.html).

Functions are as follows: `abs, neg, cmp, gt, gte, lt, lte, eq, neq, min, max, ispos, isneg, isNaN, isFinite, isint, floor, ceiling, round, add, sub, mul, div, rec, mod, gamma, fact, pow, exp, sqrt, cbrt, root, log10, logBase, log(alias ln), lambertw, tetr, iteratedexp, iteratedlog, layeradd, layeradd10, ssrt, slog, pent, arrow, chain, hyper, expansion, affordGeometricSeries, affordArithmeticSeries, sumGeometricSeries, sumArithmeticSeries, choose`. Of course, there are `toNumber()`, `toString()` (`toValue`, `toStringWithDecimalPlaces`, `toExponential`, `toFixed`, `toPrecision`), and `toJSON()`. Add ~~one of a kind~~ `toHyperE()`.

If you are using built-in constants: Constants can not be replaced directly, however **the properties of it can. As the constants are also used inside ExpantaNum.js, modifying them could CAUSE SERIOUS ISSUES AND POTENTIALLY RENDER THE LIBRARY UNUSABLE.**

If you are not planning to make something to the scale of [True Infinity](https://reinhardt-c.github.io/TrueInfinity), then use other libraries, such as, in ascending order:

* [break_infinity.js](https://github.com/Patashu/break_infinity.js) by Patashu - e9e15
* [decimal.js](https://github.com/MikeMcl/decimal.js) by MikeMcl - e9e15
* [logarithmica_numerus_lite.js](https://github.com/aarextiaokhiao/magna_numerus.js/blob/master/logarithmica_numerus_lite.js) by Aarex Tiaokhiao - e1.8e308
* [confractus_numerus.js](https://github.com/aarextiaokhiao/magna_numerus.js/blob/master/confractus_numerus.js) by Aarex Tiaokhiao - ee9e15
* [magna_numerus.js](https://github.com/aarextiaokhiao/magna_numerus.js/blob/master/magna_numerus.js) by Aarex Tiaokhiao - ?
* [break_eternity.js](https://github.com/Patashu/break_eternity.js) by Patashu - 10^^1.8e308
* [OmegaNum.js](https://github.com/Naruyoko/OmegaNum.js) by Naruyoko (me) - 10{9e15}10

Future ideas:

* ~~ExpantaNum.js - f<sub>ω+1</sub>, array of value-index pair with separate counter.~~
* OmegaExpantaNum.js - f<sub>ω2</sub>
* MegotaNum.js - f<sub>ω<sup>2</sup></sub>
* PowiainaNum.js - f<sub>ω<sup>3</sup></sub>
* GodgahNum.js - f<sub>ω<sup>ω</sup></sub>

number library, big number, big num, bignumber, bignum, big integer, biginteger, bigint, incremental games, idle games, large numbers, huge numbers, googology, javascript
