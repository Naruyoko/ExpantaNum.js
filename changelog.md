# α 1.3.2 - 2020/05/20
* Fixed freeze on processing numbers such as 10^^^^^^^10.

# α 1.3.1 - 2020/05/10
* Very small optimizations.

# α 1.3 - 2020/03/27
* Added `iteratedexp`, `iteratedlog`, `layeradd`, and `layeradd10`.
* Added voluntary `payload` argument to `tetr`.

# α 1.2.3 - 2020/03/25
* Fixed `ExpantaNum.MAX_SAFE_INTEGER.log10()` being irregular form.

# α 1.2.2 - 2020/03/23
* Fixed `toPrecision` returning `"NaN"` for `0`.
* Removed debugging residue.

# α 1.2.1 - 2020/03/23
* Fixed `toPrecision` wrongfully using `toExponential` for `0`.
* Fixed bad copy and paste, which resulted in `toJSON` completely useless.

# α 1.2 - 2020/03/23
* Added an option to use `toString` method instead of returning JSON object for `toJSON`.
* Added `valueOf`, `toStringWithDecimalPlaces`, `toExponential`, `toFixed`, and `toPrecision`.

# α 1.1.2 - 2020/03/21
* Fixed "Fixed `pent` and higher hyperoperators returning `NaN` if the base is between 10{c-1}MAX_SAFE_INTEGER and 10{c}MAX_SAFE_INTEGER, and the second operand is greater than MAX_SAFE_INTEGER" not actually.

# α 1.1.1 - 2020/03/16
* Fixed `fromObject` and `fromJSON` always returning `NaN`.
* Fixed `pent` and higher hyperoperators returning `NaN` if the base is between 10{c-1}MAX_SAFE_INTEGER and 10{c}MAX_SAFE_INTEGER, and the second operand is greater than MAX_SAFE_INTEGER.
* Allowed inputting `Object` to `fromJSON`.

# α 1.1 - 2020/02/23
* Added `notEqualTo` `notEqual` `neq`.
* Fixed `.toHyperE` always returning `"NaN"`.
* Fixed some constants used within not being `ExpantaNum`.
* Made built-in constants enumerable.

# α 1.0.1 - 2020/02/09
* Added `expansion`.
* Fixed debug being on by default.

# α 1 - 2020/02/06
* Creation as modification of [OmegaNum.js](https://github.com/Naruyoko/OmegaNum.js).