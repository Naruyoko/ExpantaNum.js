//Code snippets and templates from Decimal.js

;(function (globalScope) {
  "use strict";


  // --  EDITABLE DEFAULTS  -- //
    var ExpantaNum = {

      // The maximum number of operators stored in array.
      // If the number of operations exceed the limit, then the least significant operations will be discarded.
      // This is to prevent long loops and eating away of memory and processing time.
      // 1000 means there are at maximum of 1000 elements in array.
      // It is not recommended to make this number too big.
      // `ExpantaNum.maxOps = 1000;`
      maxOps: 1e3,

      // Specify what format is used when serializing for JSON.stringify
      // 
      // JSON   0 JSON object
      // STRING 1 String
      serializeMode: 0,
      
      // Level of debug information printed in console
      // 
      // NONE   0 Show no information.
      // NORMAL 1 Show operations.
      // ALL    2 Show everything.
      debug: 0
    },


  // -- END OF EDITABLE DEFAULTS -- //


    external = true,

    expantaNumError = "[ExpantaNumError] ",
    invalidArgument = expantaNumError + "Invalid argument: ",

    isExpantaNum = /^[-\+]*(Infinity|NaN|(J+|J\^\d+ )?(10(\^+|\{[1-9]\d*\})|\(10(\^+|\{[1-9]\d*\})\)\^[1-9]\d* )*((\d+(\.\d*)?|\d*\.\d+)?([Ee][-\+]*))*(0|\d+(\.\d*)?|\d*\.\d+))$/,

    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_E = Math.log10(MAX_SAFE_INTEGER), //15.954589770191003

    // ExpantaNum.prototype object
    P={},
    // ExpantaNum static object
    Q={},
    // ExpantaNum constants
    R={};

  // ExpantaNum prototype methods

  /*
   *  absoluteValue             abs
   *  affordArithmeticSeries
   *  affordGeometricSeries
   *  arrow
   *  ceiling                   ceil
   *  chain
   *  choose
   *  comparedTo                cmp
   *  cubeRoot                  cbrt
   *  divide                    div
   *  equals                    eq
   *  expansion
   *  exponential               exp
   *  factorial                 fact
   *  floor
   *  gamma
   *  generalLogarithm          log10
   *  greaterThan               gt
   *  greaterThanOrEqualTo      gte
   *  hyper
   *  isFinite
   *  isInfinite
   *  isInteger                 isint
   *  isNaN
   *  isNegative                isneg
   *  isPositive                ispos
   *  iteratedexp
   *  iteratedlog
   *  lambertw
   *  layeradd
   *  layeradd10
   *  lessThan                  lt
   *  lessThanOrEqualTo         lte
   *  logarithm                 logBase
   *  minus                     sub
   *  modulo                    mod
   *  naturalLogarithm          ln        log
   *  negated                   neg
   *  notequals                 neq
   *  pentate                   pent
   *  plus                      add
   *  reciprocate               rec
   *  root
   *  round
   *  slog
   *  squareRoot                sqrt
   *  ssqrt                     ssrt
   *  sumArithmeticSeries
   *  sumGeometricSeries
   *  times                     mul
   *  tetrate                   tetr
   *  toExponential
   *  toFixed
   *  toHyperE
   *  toJSON
   *  toNumber
   *  toPower                   pow
   *  toPrecision
   *  toString
   *  toStringWithDecimalPlaces
   *  valueOf
   */
  R.ZERO=0;
  R.ONE=1;
  R.E=Math.E;
  R.LN2=Math.LN2;
  R.LN10=Math.LN10;
  R.LOG2E=Math.LOG2E;
  R.LOG10E=Math.LOG10E;
  R.PI=Math.PI;
  R.SQRT1_2=Math.SQRT1_2;
  R.SQRT2=Math.SQRT2;
  R.MAX_SAFE_INTEGER=MAX_SAFE_INTEGER;
  R.MIN_SAFE_INTEGER=Number.MIN_SAFE_INTEGER;
  R.NaN=Number.NaN;
  R.NEGATIVE_INFINITY=Number.NEGATIVE_INFINITY;
  R.POSITIVE_INFINITY=Number.POSITIVE_INFINITY;
  R.E_MAX_SAFE_INTEGER="e"+MAX_SAFE_INTEGER;
  R.EE_MAX_SAFE_INTEGER="ee"+MAX_SAFE_INTEGER;
  R.TETRATED_MAX_SAFE_INTEGER="10^^"+MAX_SAFE_INTEGER;
  R.GRAHAMS_NUMBER="J^63 10^^^(10^)^7625597484984 3638334640023.7783";
  P.absoluteValue=P.abs=function(){
    var x=this.clone();
    x.sign=1;
    return x;
  };
  Q.absoluteValue=Q.abs=function(x){
    return new ExpantaNum(x).abs();
  };
  P.negate=P.neg=function (){
    var x=this.clone();
    x.sign=x.sign*-1;
    return x;
  };
  Q.negate=Q.neg=function (x){
    return new ExpantaNum(x).neg();
  };
  P.compareTo=P.cmp=function (other){
    if (!(other instanceof ExpantaNum)) other=new ExpantaNum(other);
    if (isNaN(this.array[0][1])||isNaN(other.array[0][1])) return NaN;
    if (this.array[0][1]==Infinity&&other.array[0][1]!=Infinity) return this.sign;
    if (this.array[0][1]!=Infinity&&other.array[0][1]==Infinity) return -other.sign;
    if (this.array.length==1&&this.array[0][1]===0&&other.array.length==1&&other.array[0][1]===0) return 0;
    if (this.sign!=other.sign) return this.sign;
    var m=this.sign;
    var r;
    if (this.layer>other.layer) r=1;
    else if (this.layer<other.layer) r=-1;
    else{
      var e,f;
      for (var i=0,l=Math.min(this.array.length,other.array.length);i<l;++i){
        e=this.array[this.array.length-1-i];
        f=other.array[other.array.length-1-i];
        if (e[0]>f[0]||e[0]==f[0]&&e[1]>f[1]){
          r=1;
          break;
        }else if (e[0]<f[0]||e[0]==f[0]&&e[1]<f[1]){
          r=-1;
          break;
        }
      }
      if (r===undefined){
        if (this.array.length==other.array.length){
          r=0;
        }else if (this.array.length>other.array.length){
          e=this.array[this.array.length-l];
          if (e[0]>=1||e[1]>10){
            r=1;
          }else{
            r=-1;
          }
        }else{
          e=other.array[other.array.length-l];
          if (e[0]>=1||e[1]>10){
            r=-1;
          }else{
            r=1;
          }
        }
      }
    }
    return r*m;
  };
  Q.compare=Q.cmp=function (x,y){
    return new ExpantaNum(x).cmp(y);
  };
  P.greaterThan=P.gt=function (other){
    return this.cmp(other)>0;
  };
  Q.greaterThan=Q.gt=function (x,y){
    return new ExpantaNum(x).gt(y);
  };
  P.greaterThanOrEqualTo=P.gte=function (other){
    return this.cmp(other)>=0;
  };
  Q.greaterThanOrEqualTo=Q.gte=function (x,y){
    return new ExpantaNum(x).gte(y);
  };
  P.lessThan=P.lt=function (other){
    return this.cmp(other)<0;
  };
  Q.lessThan=Q.lt=function (x,y){
    return new ExpantaNum(x).lt(y);
  };
  P.lessThanOrEqualTo=P.lte=function (other){
    return this.cmp(other)<=0;
  };
  Q.lessThanOrEqualTo=Q.lte=function (x,y){
    return new ExpantaNum(x).lte(y);
  };
  P.equalsTo=P.equal=P.eq=function (other){
    return this.cmp(other)===0;
  };
  Q.equalsTo=Q.equal=Q.eq=function (x,y){
    return new ExpantaNum(x).eq(y);
  };
  P.notEqualsTo=P.notEqual=P.neq=function (other){
    return this.cmp(other)!==0;
  };
  Q.notEqualsTo=Q.notEqual=Q.neq=function (x,y){
    return new ExpantaNum(x).neq(y);
  };
  P.minimum=P.min=function (other){
    return this.lt(other)?this.clone():new ExpantaNum(other);
  };
  Q.minimum=Q.min=function (x,y){
    return new ExpantaNum(x).min(y);
  };
  P.maximum=P.max=function (other){
    return this.gt(other)?this.clone():new ExpantaNum(other);
  };
  Q.maximum=Q.max=function (x,y){
    return new ExpantaNum(x).max(y);
  };
  P.isPositive=P.ispos=function (){
    return this.gt(ExpantaNum.ZERO);
  };
  Q.isPositive=Q.ispos=function (x){
    return new ExpantaNum(x).ispos();
  };
  P.isNegative=P.isneg=function (){
    return this.lt(ExpantaNum.ZERO);
  };
  Q.isNegative=Q.isneg=function (x){
    return new ExpantaNum(x).isneg();
  };
  P.isNaN=function (){
    return isNaN(this.array[0][1]);
  };
  Q.isNaN=function (x){
    return new ExpantaNum(x).isNaN();
  };
  P.isFinite=function (){
    return isFinite(this.array[0][1]);
  };
  Q.isFinite=function (x){
    return new ExpantaNum(x).isFinite();
  };
  P.isInfinite=function (){
    return this.array[0][1]==Infinity;
  };
  Q.isInfinite=function (x){
    return new ExpantaNum(x).isInfinite();
  };
  P.isInteger=P.isint=function (){
    if (this.sign==-1) return this.abs().isint();
    if (this.gt(ExpantaNum.MAX_SAFE_INTEGER)) return true;
    return Number.isInteger(this.toNumber());
  };
  Q.isInteger=Q.isint=function (x){
    return new ExpantaNum(x).isint();
  };
  P.floor=function (){
    if (this.isInteger()) return this.clone();
    return new ExpantaNum(Math.floor(this.toNumber()));
  };
  Q.floor=function (x){
    return new ExpantaNum(x).floor();
  };
  P.ceiling=P.ceil=function (){
    if (this.isInteger()) return this.clone();
    return new ExpantaNum(Math.ceil(this.toNumber()));
  };
  Q.ceiling=Q.ceil=function (x){
    return new ExpantaNum(x).ceil();
  };
  P.round=function (){
    if (this.isInteger()) return this.clone();
    return new ExpantaNum(Math.round(this.toNumber()));
  };
  Q.round=function (x){
    return new ExpantaNum(x).round();
  };
  P.plus=P.add=function (other){
    var x=this.clone();
    other=new ExpantaNum(other);
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log(this+"+"+other);
    if (x.sign==-1) return x.neg().add(other.neg()).neg();
    if (other.sign==-1) return x.sub(other.neg());
    if (x.eq(ExpantaNum.ZERO)) return other;
    if (other.eq(ExpantaNum.ZERO)) return x;
    if (x.isNaN()||other.isNaN()||x.isInfinite()&&other.isInfinite()&&x.eq(other.neg())) return ExpantaNum.NaN.clone();
    if (x.isInfinite()) return x;
    if (other.isInfinite()) return other;
    var p=x.min(other);
    var q=x.max(other);
    var op0=q.operator(0);
    var op1=q.operator(1);
    var t;
    if (q.gt(ExpantaNum.E_MAX_SAFE_INTEGER)||q.div(p).gt(ExpantaNum.MAX_SAFE_INTEGER)){
      t=q;
    }else if (!op1){
      t=new ExpantaNum(x.toNumber()+other.toNumber());
    }else if (op1==1){
      var a=p.operator(1)?p.operator(0):Math.log10(p.operator(0));
      t=new ExpantaNum([a+Math.log10(Math.pow(10,op0-a)+1),1]);
    }
    p=q=null;
    return t;
  };
  Q.plus=Q.add=function (x,y){
    return new ExpantaNum(x).add(y);
  };
  P.minus=P.sub=function (other){
    var x=this.clone();
    other=new ExpantaNum(other);
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log(x+"-"+other);
    if (x.sign==-1) return x.neg().sub(other.neg()).neg();
    if (other.sign==-1) return x.add(other.neg());
    if (x.eq(other)) return ExpantaNum.ZERO.clone();
    if (other.eq(ExpantaNum.ZERO)) return x;
    if (x.isNaN()||other.isNaN()||x.isInfinite()&&other.isInfinite()) return ExpantaNum.NaN.clone();
    if (x.isInfinite()) return x;
    if (other.isInfinite()) return other.neg();
    var p=x.min(other);
    var q=x.max(other);
    var n=other.gt(x);
    var op0=q.operator(0);
    var op1=q.operator(1);
    var t;
    if (q.gt(ExpantaNum.E_MAX_SAFE_INTEGER)||q.div(p).gt(ExpantaNum.MAX_SAFE_INTEGER)){
      t=q;
      t=n?t.neg():t;
    }else if (!op1){
      t=new ExpantaNum(x.toNumber()-other.toNumber());
    }else if (op1==1){
      var a=p.operator(1)?p.operator(0):Math.log10(p.operator(0));
      t=new ExpantaNum([a+Math.log10(Math.pow(10,op0-a)-1),1]);
      t=n?t.neg():t;
    }
    p=q=null;
    return t;
  };
  Q.minus=Q.sub=function (x,y){
    return new ExpantaNum(x).sub(y);
  };
  P.times=P.mul=function (other){
    var x=this.clone();
    other=new ExpantaNum(other);
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log(x+"*"+other);
    if (x.sign*other.sign==-1) return x.abs().mul(other.abs()).neg();
    if (x.sign==-1) return x.abs().mul(other.abs());
    if (x.isNaN()||other.isNaN()||x.eq(ExpantaNum.ZERO)&&other.isInfinite()||x.isInfinite()&&other.abs().eq(ExpantaNum.ZERO)) return ExpantaNum.NaN.clone();
    if (other.eq(ExpantaNum.ZERO)) return ExpantaNum.ZERO.clone();
    if (other.eq(ExpantaNum.ONE)) return x.clone();
    if (x.isInfinite()) return x;
    if (other.isInfinite()) return other;
    if (x.max(other).gt(ExpantaNum.EE_MAX_SAFE_INTEGER)) return x.max(other);
    var n=x.toNumber()*other.toNumber();
    if (n<=MAX_SAFE_INTEGER) return new ExpantaNum(n);
    return ExpantaNum.pow(10,x.log10().add(other.log10()));
  };
  Q.times=Q.mul=function (x,y){
    return new ExpantaNum(x).mul(y);
  };
  P.divide=P.div=function (other){
    var x=this.clone();
    other=new ExpantaNum(other);
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log(x+"/"+other);
    if (x.sign*other.sign==-1) return x.abs().div(other.abs()).neg();
    if (x.sign==-1) return x.abs().div(other.abs());
    if (x.isNaN()||other.isNaN()||x.isInfinite()&&other.isInfinite()||x.eq(ExpantaNum.ZERO)&&other.eq(ExpantaNum.ZERO)) return ExpantaNum.NaN.clone();
    if (other.eq(ExpantaNum.ZERO)) return ExpantaNum.POSITIVE_INFINITY.clone();
    if (other.eq(ExpantaNum.ONE)) return x.clone();
    if (x.eq(other)) return ExpantaNum.ONE.clone();
    if (x.isInfinite()) return x;
    if (other.isInfinite()) return ExpantaNum.ZERO.clone();
    if (x.max(other).gt(ExpantaNum.EE_MAX_SAFE_INTEGER)) return x.gt(other)?x.clone():ExpantaNum.ZERO.clone();
    var n=x.toNumber()/other.toNumber();
    if (n<=MAX_SAFE_INTEGER) return new ExpantaNum(n);
    var pw=ExpantaNum.pow(10,x.log10().sub(other.log10()));
    var fp=pw.floor();
    if (pw.sub(fp).lt(new ExpantaNum(1e-9))) return fp;
    return pw;
  };
  Q.divide=Q.div=function (x,y){
    return new ExpantaNum(x).div(y);
  };
  P.reciprocate=P.rec=function (){
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log(this+"^-1");
    if (this.isNaN()||this.eq(ExpantaNum.ZERO)) return ExpantaNum.NaN.clone();
    if (this.abs().gt("2e323")) return ExpantaNum.ZERO.clone();
    return new ExpantaNum(1/this);
  };
  Q.reciprocate=Q.rec=function (x){
    return new ExpantaNum(x).rec();
  };
  P.modular=P.mod=function (other){
    other=new ExpantaNum(other);
    if (other.eq(ExpantaNum.ZERO)) return ExpantaNum.ZERO.clone();
    if (this.sign*other.sign==-1) return this.abs().mod(other.abs()).neg();
    if (this.sign==-1) return this.abs().mod(other.abs());
    return this.sub(this.div(other).floor().mul(other));
  };
  Q.modular=Q.mod=function (x,y){
    return new ExpantaNum(x).mod(y);
  };
  //All of these are from Patashu's break_eternity.js
  //from HyperCalc source code
  var f_gamma=function (n){
    if (!isFinite(n)) return n;
    if (n<-50){
      if (n==Math.trunc(n)) return Number.NEGATIVE_INFINITY;
      return 0;
    }
    var scal1=1;
    while (n<10){
      scal1=scal1*n;
      ++n;
    }
    n-=1;
    var l=0.9189385332046727; //0.5*Math.log(2*Math.PI)
    l+=(n+0.5)*Math.log(n);
    l-=n;
    var n2=n*n;
    var np=n;
    l+=1/(12*np);
    np*=n2;
    l+=1/(360*np);
    np*=np*n2;
    l+=1/(1260*np);
    np*=n2;
    l+=1/(1680*np);
    np*=n2;
    l+=1/(1188*np);
    np*=n2;
    l+=691/(360360*np);
    np*=n2;
    l+=7/(1092*np);
    np*=n2;
    l+=3617/(122400*np);
    return Math.exp(l)/scal1;
  };
  //from HyperCalc source code
  P.gamma=function (){
    var x=this.clone();
    if (x.gt(ExpantaNum.TETRATED_MAX_SAFE_INTEGER)) return x;
    if (x.gt(ExpantaNum.E_MAX_SAFE_INTEGER)) return ExpantaNum.exp(x);
    if (x.gt(ExpantaNum.MAX_SAFE_INTEGER)) return ExpantaNum.exp(ExpantaNum.mul(x,ExpantaNum.ln(x).sub(1)));
    var n=x.operator(0);
    if (n>1){
      if (n<24) return new ExpantaNum(f_gamma(x.sign*n));
      var t=n-1;
      var l=0.9189385332046727; //0.5*Math.log(2*Math.PI)
      l+=((t+0.5)*Math.log(t));
      l-=t;
      var n2=t*t;
      var np=t;
      var lm=12*np;
      var adj=1/lm;
      var l2=l+adj;
      if (l2==l) return ExpantaNum.exp(l);
      l=l2;
      np*=n2;
      lm=360*np;
      adj=1/lm;
      l2=l-adj;
      if (l2==l) return ExpantaNum.exp(l);
      l=l2;
      np*=n2;
      lm=1260*np;
      var lt=1/lm;
      l+=lt;
      np*=n2;
      lm=1680*np;
      lt=1/lm;
      l-=lt;
      return ExpantaNum.exp(l);
    }else return this.rec();
  };
  Q.gamma=function (x){
    return new ExpantaNum(x).gamma();
  };
  //end break_eternity.js excerpt
  Q.factorials=[1,1,2,6,24,120,720,5040,40320,362880,3628800,39916800,479001600,6227020800,87178291200,1307674368000,20922789888000,355687428096000,6402373705728000,121645100408832000,2432902008176640000,51090942171709440000,1.1240007277776076800e+21,2.5852016738884978213e+22,6.2044840173323941000e+23,1.5511210043330986055e+25,4.0329146112660565032e+26,1.0888869450418351940e+28,3.0488834461171387192e+29,8.8417619937397018986e+30,2.6525285981219106822e+32,8.2228386541779224302e+33,2.6313083693369351777e+35,8.6833176188118859387e+36,2.9523279903960415733e+38,1.0333147966386145431e+40,3.7199332678990125486e+41,1.3763753091226345579e+43,5.2302261746660111714e+44,2.0397882081197444123e+46,8.1591528324789768380e+47,3.3452526613163807956e+49,1.4050061177528799549e+51,6.0415263063373834074e+52,2.6582715747884488694e+54,1.1962222086548018857e+56,5.5026221598120891536e+57,2.5862324151116817767e+59,1.2413915592536072528e+61,6.0828186403426752249e+62,3.0414093201713375576e+64,1.5511187532873821895e+66,8.0658175170943876846e+67,4.2748832840600254848e+69,2.3084369733924137924e+71,1.2696403353658276447e+73,7.1099858780486348103e+74,4.0526919504877214100e+76,2.3505613312828784949e+78,1.3868311854568983861e+80,8.3209871127413898951e+81,5.0758021387722483583e+83,3.1469973260387939390e+85,1.9826083154044400850e+87,1.2688693218588416544e+89,8.2476505920824715167e+90,5.4434493907744306945e+92,3.6471110918188683221e+94,2.4800355424368305480e+96,1.7112245242814129738e+98,1.1978571669969892213e+100,8.5047858856786230047e+101,6.1234458376886084639e+103,4.4701154615126843855e+105,3.3078854415193862416e+107,2.4809140811395399745e+109,1.8854947016660503806e+111,1.4518309202828587210e+113,1.1324281178206296794e+115,8.9461821307829757136e+116,7.1569457046263805709e+118,5.7971260207473678414e+120,4.7536433370128420198e+122,3.9455239697206587884e+124,3.3142401345653531943e+126,2.8171041143805501310e+128,2.4227095383672734128e+130,2.1077572983795278544e+132,1.8548264225739843605e+134,1.6507955160908460244e+136,1.4857159644817615149e+138,1.3520015276784029158e+140,1.2438414054641308179e+142,1.1567725070816415659e+144,1.0873661566567430754e+146,1.0329978488239059305e+148,9.9167793487094964784e+149,9.6192759682482120384e+151,9.4268904488832479837e+153,9.3326215443944153252e+155,9.3326215443944150966e+157,9.4259477598383598816e+159,9.6144667150351270793e+161,9.9029007164861804721e+163,1.0299016745145628100e+166,1.0813967582402909767e+168,1.1462805637347083683e+170,1.2265202031961380050e+172,1.3246418194518290179e+174,1.4438595832024936625e+176,1.5882455415227430287e+178,1.7629525510902445874e+180,1.9745068572210740115e+182,2.2311927486598137657e+184,2.5435597334721876552e+186,2.9250936934930159967e+188,3.3931086844518980862e+190,3.9699371608087210616e+192,4.6845258497542909237e+194,5.5745857612076058231e+196,6.6895029134491271205e+198,8.0942985252734440920e+200,9.8750442008336010580e+202,1.2146304367025329301e+205,1.5061417415111409314e+207,1.8826771768889261129e+209,2.3721732428800468512e+211,3.0126600184576594309e+213,3.8562048236258040716e+215,4.9745042224772874590e+217,6.4668554892204741474e+219,8.4715806908788206314e+221,1.1182486511960043298e+224,1.4872707060906857134e+226,1.9929427461615187928e+228,2.6904727073180504073e+230,3.6590428819525488642e+232,5.0128887482749919605e+234,6.9177864726194885808e+236,9.6157231969410893532e+238,1.3462012475717525742e+241,1.8981437590761708898e+243,2.6953641378881628530e+245,3.8543707171800730787e+247,5.5502938327393044385e+249,8.0479260574719917061e+251,1.1749972043909107097e+254,1.7272458904546389230e+256,2.5563239178728653927e+258,3.8089226376305697893e+260,5.7133839564458546840e+262,8.6272097742332399855e+264,1.3113358856834524492e+267,2.0063439050956822953e+269,3.0897696138473507759e+271,4.7891429014633940780e+273,7.4710629262828942235e+275,1.1729568794264144743e+278,1.8532718694937349890e+280,2.9467022724950384028e+282,4.7147236359920616095e+284,7.5907050539472189932e+286,1.2296942187394494177e+289,2.0044015765453026266e+291,3.2872185855342959088e+293,5.4239106661315886750e+295,9.0036917057784375454e+297,1.5036165148649991456e+300,2.5260757449731984219e+302,4.2690680090047051083e+304,7.2574156153079990350e+306];
  P.factorial=P.fact=function (){
    var x=this.clone();
    var f=ExpantaNum.factorials;
    if (x.lt(ExpantaNum.ZERO)||!x.isint()) return x.add(1).gamma();
    if (x.lte(170)) return new ExpantaNum(f[+x]);
    var errorFixer=1;
    var e=+x;
    if (e<500) e+=163879/209018880*Math.pow(e,5);
    if (e<1000) e+=-571/2488320*Math.pow(e,4);
    if (e<50000) e+=-139/51840*Math.pow(e,3);
    if (e<1e7) e+=1/288*Math.pow(e,2);
    if (e<1e20) e+=1/12*e;
    return x.div(ExpantaNum.E).pow(x).mul(x.mul(ExpantaNum.PI).mul(2).sqrt()).times(errorFixer);
  };
  Q.factorial=Q.fact=function (x){
    return new ExpantaNum(x).fact();
  };
  P.toPower=P.pow=function (other){
    other=new ExpantaNum(other);
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log(this+"^"+other);
    if (other.eq(ExpantaNum.ZERO)) return ExpantaNum.ONE.clone();
    if (other.eq(ExpantaNum.ONE)) return this.clone();
    if (other.lt(ExpantaNum.ZERO)) return this.pow(other.neg()).rec();
    if (this.lt(ExpantaNum.ZERO)&&other.isint()){
      if (other.mod(2).lt(ExpantaNum.ONE)) return this.abs().pow(other);
      return this.abs().pow(other).neg();
    }
    if (this.lt(ExpantaNum.ZERO)) return ExpantaNum.NaN.clone();
    if (this.eq(ExpantaNum.ONE)) return ExpantaNum.ONE.clone();
    if (this.eq(ExpantaNum.ZERO)) return ExpantaNum.ZERO.clone();
    if (this.max(other).gt(ExpantaNum.TETRATED_MAX_SAFE_INTEGER)) return this.max(other);
    if (this.eq(10)){
      if (other.gt(ExpantaNum.ZERO)){
        other.operator(1,(other.operator(1)+1)||1);
        other.standardize();
        return other;
      }else{
        return new ExpantaNum(Math.pow(10,other.toNumber()));
      }
    }
    if (other.lt(ExpantaNum.ONE)) return this.root(other.rec());
    var n=Math.pow(this.toNumber(),other.toNumber());
    if (n<=MAX_SAFE_INTEGER) return new ExpantaNum(n);
    return ExpantaNum.pow(10,this.log10().mul(other));
  };
  Q.toPower=Q.pow=function (x,y){
    return new ExpantaNum(x).pow(y);
  };
  P.exponential=P.exp=function (){
    return ExpantaNum.pow(Math.E,this);
  };
  Q.exponential=Q.exp=function (x){
    return ExpantaNum.pow(Math.E,x);
  };
  P.squareRoot=P.sqrt=function (){
    return this.root(2);
  };
  Q.squareRoot=Q.sqrt=function (x){
    return new ExpantaNum(x).root(2);
  };
  P.cubeRoot=P.cbrt=function (){
    return this.root(3);
  };
  Q.cubeRoot=Q.cbrt=function (x){
    return new ExpantaNum(x).root(3);
  };
  P.root=function (other){
    other=new ExpantaNum(other);
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log(this+"root"+other);
    if (other.eq(ExpantaNum.ONE)) return this.clone();
    if (other.lt(ExpantaNum.ZERO)) return this.root(other.neg()).rec();
    if (other.lt(ExpantaNum.ONE)) return this.pow(other.rec());
    if (this.lt(ExpantaNum.ZERO)&&other.isint()&&other.mod(2).eq(ExpantaNum.ONE)) return this.neg().root(other).neg();
    if (this.lt(ExpantaNum.ZERO)) return ExpantaNum.NaN.clone();
    if (this.eq(ExpantaNum.ONE)) return ExpantaNum.ONE.clone();
    if (this.eq(ExpantaNum.ZERO)) return ExpantaNum.ZERO.clone();
    if (this.max(other).gt(ExpantaNum.TETRATED_MAX_SAFE_INTEGER)) return this.gt(other)?this.clone():ExpantaNum.ZERO.clone();
    return ExpantaNum.pow(10,this.log10().div(other));
  };
  Q.root=function (x,y){
    return new ExpantaNum(x).root(y);
  };
  P.generalLogarithm=P.log10=function (){
    var x=this.clone();
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log("log"+this);
    if (x.lt(ExpantaNum.ZERO)) return ExpantaNum.NaN.clone();
    if (x.eq(ExpantaNum.ZERO)) return ExpantaNum.NEGATIVE_INFINITY.clone();
    if (x.lte(ExpantaNum.MAX_SAFE_INTEGER)) return new ExpantaNum(Math.log10(x.toNumber()));
    if (!x.isFinite()) return x;
    if (x.gt(ExpantaNum.TETRATED_MAX_SAFE_INTEGER)) return x;
    x.operator(1,x.operator(1)-1);
    return x.standardize();
  };
  Q.generalLogarithm=Q.log10=function (x){
    return new ExpantaNum(x).log10();
  };
  P.logarithm=P.logBase=function (base){
    if (base===undefined) base=Math.E;
    return this.log10().div(ExpantaNum.log10(base));
  };
  Q.logarithm=Q.logBase=function (x,base){
    return new ExpantaNum(x).logBase(base);
  };
  P.naturalLogarithm=P.log=P.ln=function (){
    return this.logBase(Math.E);
  };
  Q.naturalLogarithm=Q.log=Q.ln=function (x){
    return new ExpantaNum(x).ln();
  };
  //All of these are from Patashu's break_eternity.js
  var OMEGA=0.56714329040978387299997;  //W(1,0)
  //from https://math.stackexchange.com/a/465183
  //The evaluation can become inaccurate very close to the branch point
  var f_lambertw=function (z,tol){
    if (tol===undefined) tol=1e-10;
    var w;
    var wn;
    if (!Number.isFinite(z)) return z;
    if (z===0) return z;
    if (z===1) return OMEGA;
    if (z<10) w=0;
    else w=Math.log(z)-Math.log(Math.log(z));
    for (var i=0;i<100;++i){
      wn=(z*Math.exp(-w)+w*w)/(w+1);
      if (Math.abs(wn-w)<tol*Math.abs(wn)) return wn;
      w=wn;
    }
    throw Error("Iteration failed to converge: "+z);
    //return Number.NaN;
  };
  //from https://github.com/scipy/scipy/blob/8dba340293fe20e62e173bdf2c10ae208286692f/scipy/special/lambertw.pxd
  //The evaluation can become inaccurate very close to the branch point
  //at ``-1/e``. In some corner cases, `lambertw` might currently
  //fail to converge, or can end up on the wrong branch.
  var d_lambertw=function (z,tol){
    if (tol===undefined) tol=1e-10;
    z=new ExpantaNum(z);
    var w;
    var ew, wewz, wn;
    if (!z.isFinite()) return z;
    if (z===0) return z;
    if (z===1){
      //Split out this case because the asymptotic series blows up
      return OMEGA;
    }
    //Get an initial guess for Halley's method
    w=ExpantaNum.ln(z);
    //Halley's method; see 5.9 in [1]
    for (var i=0;i<100;++i){
      ew=ExpantaNum.exp(-w);
      wewz=w.sub(z.mul(ew));
      wn=w.sub(wewz.div(w.add(ExpantaNum.ONE).sub((w.add(2)).mul(wewz).div((ExpantaNum.mul(2,w).add(2))))));
      if (ExpantaNum.abs(wn.sub(w)).lt(ExpantaNum.abs(wn).mul(tol))) return wn;
      w = wn;
    }
    throw Error("Iteration failed to converge: "+z);
    //return Decimal.dNaN;
  };
  //The Lambert W function, also called the omega function or product logarithm, is the solution W(x) === x*e^x.
  //https://en.wikipedia.org/wiki/Lambert_W_function
  //Some special values, for testing: https://en.wikipedia.org/wiki/Lambert_W_function#Special_values
  P.lambertw=function (){
    var x=this.clone();
    if (x.isNaN()) return x;
    if (x.lt(-0.3678794411710499)) throw Error("lambertw is unimplemented for results less than -1, sorry!");
    if (x.gt(ExpantaNum.TETRATED_MAX_SAFE_INTEGER)) return x;
    if (x.gt(ExpantaNum.EE_MAX_SAFE_INTEGER)){
      x.operator(1,x.operator(1)-1);
      return x;
    }
    if (x.gt(ExpantaNum.MAX_SAFE_INTEGER)) return d_lambertw(x);
    else return new ExpantaNum(f_lambertw(x.sign*x.operator(0)));
  };
  Q.lambertw=function (x){
    return new ExpantaNum(x).lambertw();
  };
  //end break_eternity.js excerpt
  //Uses linear approximations for real height
  P.tetrate=P.tetr=function (other,payload){
    if (payload===undefined) payload=ExpantaNum.ONE;
    var t=this.clone();
    other=new ExpantaNum(other);
    payload=new ExpantaNum(payload);
    if (payload.neq(ExpantaNum.ONE)) other=other.add(payload.slog(t));
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log(t+"^^"+other);
    var negln;
    if (t.isNaN()||other.isNaN()||payload.isNaN()) return ExpantaNum.NaN.clone();
    if (other.isInfinite()&&other.sign>0){
      if (t.gte(Math.exp(1/Math.E))) return ExpantaNum.POSITIVE_INFINITY.clone();
      //Formula for infinite height power tower.
      negln = t.ln().neg();
      return negln.lambertw().div(negln);
    }
    if (other.lte(-2)) return ExpantaNum.NaN.clone();
    if (t.eq(ExpantaNum.ZERO)){
      if (other.eq(ExpantaNum.ZERO)) return ExpantaNum.NaN.clone();
      if (other.mod(2).eq(ExpantaNum.ZERO)) return ExpantaNum.ZERO.clone();
      return ExpantaNum.ONE.clone();
    }
    if (t.eq(ExpantaNum.ONE)){
      if (other.eq(ExpantaNum.ONE.neg())) return ExpantaNum.NaN.clone();
      return ExpantaNum.ONE.clone();
    }
    if (other.eq(ExpantaNum.ONE.neg())) return ExpantaNum.ZERO.clone();
    if (other.eq(ExpantaNum.ZERO)) return ExpantaNum.ONE.clone();
    if (other.eq(ExpantaNum.ONE)) return t;
    if (other.eq(2)) return t.pow(t);
    if (t.eq(2)){
      if (other.eq(3)) return new ExpantaNum(16);
      if (other.eq(4)) return new ExpantaNum(65536);
    }
    var m=t.max(other);
    if (m.gt("10^^^"+MAX_SAFE_INTEGER)) return m;
    if (m.gt(ExpantaNum.TETRATED_MAX_SAFE_INTEGER)||other.gt(ExpantaNum.MAX_SAFE_INTEGER)){
      if (this.lt(Math.exp(1/Math.E))){
        negln = t.ln().neg();
        return negln.lambertw().div(negln);
      }
      var j=t.slog(10).add(other);
      j.operator(2,(j.operator(2)||0)+1);
      j.standardize();
      return j;
    }
    var y=other.toNumber();
    var f=Math.floor(y);
    var r=t.pow(y-f);
    var l=ExpantaNum.NaN;
    for (var i=0,w=new ExpantaNum(ExpantaNum.E_MAX_SAFE_INTEGER);f!==0&&r.lt(w)&&i<100;++i){
      if (f>0){
        r=t.pow(r);
        if (l.eq(r)){
          f=0;
          break;
        }
        l=r;
        --f;
      }else{
        r=r.logBase(t);
        if (l.eq(r)){
          f=0;
          break;
        }
        l=r;
        ++f;
      }
    }
    if (i==100||this.lt(Math.exp(1/Math.E))) f=0;
    r.operator(1,(r.operator(1)+f)||f);
    r.standardize();
    return r;
  };
  Q.tetrate=Q.tetr=function (x,y,payload){
    return new ExpantaNum(x).tetr(y,payload);
  };
  //Implementation of functions from break_eternity.js
  P.iteratedexp=function (other,payload){
    return this.tetr(other,payload);
  };
  Q.iteratedexp=function (x,y,payload){
    return new ExpantaNum(x).iteratedexp(other,payload);
  };
  //This implementation is highly inaccurate and slow, and probably be given custom code
  P.iteratedlog=function (base,other){
    if (base===undefined) base=10;
    if (other===undefined) other=ExpantaNum.ONE.clone();
    var t=this.clone();
    if (other.eq(ExpantaNum.ZERO)) return t;
    if (other.eq(ExpantaNum.ONE)) return t.logBase(base);
    base=new ExpantaNum(base);
    other=new ExpantaNum(other);
    return base.tetr(t.slog(base).sub(other));
  };
  Q.iteratedlog=function (x,y,z){
    return new ExpantaNum(x).iteratedlog(y,z);
  };
  P.layeradd=function (other,base){
    if (base===undefined) base=10;
    if (other===undefined) other=ExpantaNum.ONE.clone();
    var t=this.clone();
    base=new ExpantaNum(base);
    other=new ExpantaNum(other);
    return base.tetr(t.slog(base).add(other));
  };
  Q.layeradd=function (x,y,z){
    return new ExpantaNum(x).layeradd(y,z);
  };
  P.layeradd10=function (other){
    return this.layeradd(other);
  };
  Q.layeradd10=function (x,y){
    return new ExpantaNum(x).layeradd10(y);
  };
  //End implementation from break_eternity.js
  //All of these are from Patashu's break_eternity.js
  //The super square-root function - what number, tetrated to height 2, equals this?
  //Other sroots are possible to calculate probably through guess and check methods, this one is easy though.
  //https://en.wikipedia.org/wiki/Tetration#Super-root
  P.ssqrt=P.ssrt=function (){
    var x=this.clone();
    if (x.lt(Math.exp(-1/Math.E))) return ExpantaNum.NaN.clone();
    if (!x.isFinite()) return x;
    if (x.gt(ExpantaNum.TETRATED_MAX_SAFE_INTEGER)) return x;
    if (x.gt(ExpantaNum.EE_MAX_SAFE_INTEGER)){
      x.operator(1,x.operator(1)-1);
      return x;
    }
    var l=x.ln();
    return l.div(l.lambertw());
  };
  Q.ssqrt=Q.ssrt=function (x){
    return new ExpantaNum(x).ssqrt();
  };
  //Super-logarithm, one of tetration's inverses, tells you what size power tower you'd have to tetrate base to to get number. By definition, will never be higher than 1.8e308 in break_eternity.js, since a power tower 1.8e308 numbers tall is the largest representable number.
  //Uses linear approximation
  //https://en.wikipedia.org/wiki/Super-logarithm
  P.slog=function (base){
    if (base===undefined) base=10;
    var x=new ExpantaNum(this);
    base=new ExpantaNum(base);
    if (x.isNaN()||base.isNaN()||x.isInfinite()&&base.isInfinite()) return ExpantaNum.NaN.clone();
    if (x.isInfinite()) return x;
    if (base.isInfinite()) return ExpantaNum.ZERO.clone();
    if (x.lt(ExpantaNum.ZERO)) return ExpantaNum.ONE.neg();
    if (x.eq(ExpantaNum.ONE)) return ExpantaNum.ZERO.clone();
    if (x.eq(base)) return ExpantaNum.ONE.clone();
    if (base.lt(Math.exp(1/Math.E))){
      var a=ExpantaNum.tetr(base,Infinity);
      if (x.eq(a)) return ExpantaNum.POSITIVE_INFINITY.clone();
      if (x.gt(a)) return ExpantaNum.NaN.clone();
    }
    if (x.max(base).gt("10^^^"+MAX_SAFE_INTEGER)){
      if (x.gt(base)) return x;
      return ExpantaNum.ZERO.clone();
    }
    if (x.max(base).gt(ExpantaNum.TETRATED_MAX_SAFE_INTEGER)){
      if (x.gt(base)){
        x.operator(2,x.operator(2)-1);
        x.standardize();
        return x.sub(x.operator(1));
      }
      return ExpantaNum.ZERO.clone();
    }
    var r=0;
    var t=(x.operator(1)||0)-(base.operator(1)||0);
    if (t>3){
      var l=t-3;
      r+=l;
      x.operator(1,x.operator(1)-l);
    }
    for (var i=0;i<100;++i){
      if (x.lt(ExpantaNum.ZERO)){
        x=ExpantaNum.pow(base,x);
        --r;
      }else if (x.lte(1)){
        return new ExpantaNum(r+x.toNumber()-1);
      }else{
        ++r;
        x=ExpantaNum.logBase(x,base);
      }
    }
    if (x.gt(10))
    return new ExpantaNum(r);
  };
  Q.slog=function (x,y){
    return new ExpantaNum(x).slog(y);
  };
  //end break_eternity.js excerpt
  P.pentate=P.pent=function (other){
    return this.arrow(3)(other);
  };
  Q.pentate=Q.pent=function (x,y){
    return ExpantaNum.arrow(x,3,y);
  };
  //Uses linear approximations for real height
  P.arrow=function (arrows){
    var t=this.clone();
    arrows=new ExpantaNum(arrows);
    if (!arrows.isint()||arrows.lt(ExpantaNum.ZERO)) return function(other){return ExpantaNum.NaN.clone();};
    if (arrows.eq(ExpantaNum.ZERO)) return function(other){return t.mul(other);};
    if (arrows.eq(ExpantaNum.ONE)) return function(other){return t.pow(other);};
    if (arrows.eq(2)) return function(other){return t.tetr(other);};
    return function (other){
      var depth;
      if (arguments.length==2) depth=arguments[1]; //must hide
      else depth=0;
      other=new ExpantaNum(other);
      var r;
      if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log(t+"{"+arrows+"}"+other);
    if (t.isNaN()||other.isNaN()) return ExpantaNum.NaN.clone();
      if (other.lt(ExpantaNum.ZERO)) return ExpantaNum.NaN.clone();
      if (t.eq(ExpantaNum.ZERO)){
        if (other.eq(ExpantaNum.ONE)) return ExpantaNum.ZERO.clone();
        return ExpantaNum.NaN.clone();
      }
      if (t.eq(ExpantaNum.ONE)) return ExpantaNum.ONE.clone();
      if (other.eq(ExpantaNum.ZERO)) return ExpantaNum.ONE.clone();
      if (other.eq(ExpantaNum.ONE)) return t.clone();
      if (arrows.gt(ExpantaNum.MAX_SAFE_INTEGER)){
        r=arrows.clone();
        r.layer++;
        return r;
      }
      var arrowsNum=arrows.toNumber();
      if (other.eq(2)) return t.arrow(arrowsNum-1)(t,depth+1);
      if (t.max(other).gt("10{"+(arrowsNum+1)+"}"+MAX_SAFE_INTEGER)) return t.max(other);
      if (t.gt("10{"+arrowsNum+"}"+MAX_SAFE_INTEGER)||other.gt(ExpantaNum.MAX_SAFE_INTEGER)){
        if (t.gt("10{"+arrowsNum+"}"+MAX_SAFE_INTEGER)){
          r=t.clone();
          r.operator(arrowsNum,r.operator(arrowsNum)-1);
          r.standardize();
        }else if (t.gt("10{"+(arrowsNum-1)+"}"+MAX_SAFE_INTEGER)){
          r=new ExpantaNum(t.operator(arrowsNum-1));
        }else{
          r=ExpantaNum.ZERO;
        }
        var j=r.add(other);
        j.operator(arrowsNum,(j.operator(arrowsNum)||0)+1);
        j.standardize();
        return j;
      }
      if (depth>=ExpantaNum.maxOps+10){
        return new ExpantaNum([[0,10],[arrowsNum,1]]);
      }
      var y=other.toNumber();
      var f=Math.floor(y);
      var arrows_m1=arrows.sub(OmegaNum.ONE);
      r=t.arrow(arrows_m1)(y-f,depth+1);
      for (var i=0,m=new ExpantaNum("10{"+(arrowsNum-1)+"}"+MAX_SAFE_INTEGER);f!==0&&r.lt(m)&&i<100;++i){
        if (f>0){
          r=t.arrow(arrows_m1)(r,depth+1);
          --f;
        }
      }
      if (i==100) f=0;
      r.operator(arrowsNum-1,(r.operator(arrowsNum-1)+f)||f);
      r.standardize();
      return r;
    };
  };
  P.chain=function (other,arrows){
    return this.arrow(arrows)(other);
  };
  Q.arrow=function (x,z,y){
    return new ExpantaNum(x).arrow(z)(y);
  };
  Q.chain=function (x,y,z){
    return new ExpantaNum(x).arrow(z)(y);
  };
  Q.hyper=function (z){
    z=new ExpantaNum(z);
    if (z.eq(ExpantaNum.ZERO)) return function(x,y){return new ExpantaNum(y).eq(ExpantaNum.ZERO)?new ExpantaNum(x):new ExpantaNum(x).add(ExpantaNum.ONE);};
    if (z.eq(ExpantaNum.ONE)) return function(x,y){return ExpantaNum.add(x,y);};
    return function(x,y){return new ExpantaNum(x).arrow(z.sub(2))(y);};
  };
  P.expansion=function (other){
    var t=this.clone();
    other=new ExpantaNum(other);
    var r;
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log("{"+t+","+other+",1,2}");
    if (other.lte(ExpantaNum.ZERO)||!other.isint()) return ExpantaNum.NaN.clone();
    if (other.eq(ExpantaNum.ONE)) return t.clone();
    if (!t.isint()) return ExpantaNum.NaN.clone();
    if (t.eq(2)) return new ExpantaNum(4);
    if (other.gt(ExpantaNum.MAX_SAFE_INTEGER)) return ExpantaNum.POSITIVE_INFINITY.clone();
    var f=other.toNumber()-1;
    r=t;
    for (var i=0;f!==0&&r.lt(ExpantaNum.MAX_SAFE_INTEGER)&&i<100;++i){
      if (f>0){
        r=t.arrow(r)(t);
        --f;
      }
    }
    if (i==100) f=0;
    r.layer+=f;
    r.standardize();
    return r;
  };
  Q.expansion=function (x,y){
    return new ExpantaNum(x).expansion(y);
  };
  // All of these are from Patashu's break_eternity.js
  Q.affordGeometricSeries = function (resourcesAvailable, priceStart, priceRatio, currentOwned) {
    /*
      If you have resourcesAvailable, the price of something starts at
      priceStart, and on each purchase it gets multiplied by priceRatio,
      and you have already bought currentOwned, how many of the object
      can you buy.
    */
    resourcesAvailable=new ExpantaNum(resourcesAvailable);
    priceStart=new ExpantaNum(priceStart);
    priceRatio=new ExpantaNum(priceRatio);
    var actualStart = priceStart.mul(priceRatio.pow(currentOwned));
    return ExpantaNum.floor(resourcesAvailable.div(actualStart).mul(priceRatio.sub(ExpantaNum.ONE)).add(ExpantaNum.ONE).log10().div(priceRatio.log10()));
  };
  Q.affordArithmeticSeries = function (resourcesAvailable, priceStart, priceAdd, currentOwned) {
    /*
      If you have resourcesAvailable, the price of something starts at
      priceStart, and on each purchase it gets increased by priceAdd,
      and you have already bought currentOwned, how many of the object
      can you buy.
    */
    resourcesAvailable=new ExpantaNum(resourcesAvailable);
    priceStart=new ExpantaNum(priceStart);
    priceAdd=new ExpantaNum(priceAdd);
    currentOwned=new ExpantaNum(currentOwned);
    var actualStart = priceStart.add(currentOwned.mul(priceAdd));
    var b = actualStart.sub(priceAdd.div(2));
    var b2 = b.pow(2);
    return b.neg().add(b2.add(priceAdd.mul(resourcesAvailable).mul(2)).sqrt()).div(priceAdd).floor();
  };
  Q.sumGeometricSeries = function (numItems, priceStart, priceRatio, currentOwned) {
    /*
      If you want to buy numItems of something, the price of something starts at
      priceStart, and on each purchase it gets multiplied by priceRatio,
      and you have already bought currentOwned, what will be the price of numItems
      of something.
    */
    priceStart=new ExpantaNum(priceStart);
    priceRatio=new ExpantaNum(priceRatio);
    return priceStart.mul(priceRatio.pow(currentOwned)).mul(ExpantaNum.sub(ExpantaNum.ONE, priceRatio.pow(numItems))).div(ExpantaNum.sub(ExpantaNum.ONE, priceRatio));
  };
  Q.sumArithmeticSeries = function (numItems, priceStart, priceAdd, currentOwned) {
    /*
      If you want to buy numItems of something, the price of something starts at
      priceStart, and on each purchase it gets increased by priceAdd,
      and you have already bought currentOwned, what will be the price of numItems
      of something.
    */
    numItems=new ExpantaNum(numItems);
    priceStart=new ExpantaNum(priceStart);
    currentOwned=new ExpantaNum(currentOwned);
    var actualStart = priceStart.add(currentOwned.mul(priceAdd));

    return numItems.div(2).mul(actualStart.mul(2).plus(numItems.sub(ExpantaNum.ONE).mul(priceAdd)));
  };
  // Binomial Coefficients n choose k
  Q.choose = function (n, k) {
    /*
      If you have n items and you take k out,
      how many ways could you do this?
    */
    return new ExpantaNum(n).factorial().div(new ExpantaNum(k).factorial().mul(new ExpantaNum(n).sub(new ExpantaNum(k)).factorial()));
  };
  P.choose = function (other) {
    return ExpantaNum.choose(this, other);
  };
  //end break_eternity.js excerpt
  P.standardize=function (){
    var b;
    var x=this;
    if (ExpantaNum.debug>=ExpantaNum.ALL) console.log(x.toString());
    if (!x.array||!x.array.length) x.array=[[0,0]];
    if (x.sign!=1&&x.sign!=-1){
      if (typeof x.sign!="number") x.sign=Number(x.sign);
      x.sign=x.sign<0?-1:1;
    }
    if (x.layer>MAX_SAFE_INTEGER){
      x.array=[[0,Infinity]];
      x.layer=0;
      return x;
    }
    if (Number.isInteger(x.layer)) x.layer=Math.floor(x.layer);
    for (var i=0;i<x.array.length;++i){
      var e=x.array[i];
      if (e[0]===null||e[0]===undefined){
        e[0]=0;
      }
      if (e[0]!==0&&(e[1]===0||e[1]===null||e[1]===undefined)){
        x.array.splice(i,1);
        --i;
        continue;
      }
      if (isNaN(e[0])||isNaN(e[1])){
        x.array=[[0,NaN]];
        return x;
      }
      if (!isFinite(e[0])||!isFinite(e[1])){
        x.array=[[0,Infinity]];
        return x;
      }
      if (!Number.isInteger(e[0])) e[0]=Math.floor(e[0]);
      if (e[0]!==0&&!Number.isInteger(e[1])) e[1]=Math.floor(e[1]);
    }
    do{
      if (ExpantaNum.debug>=ExpantaNum.ALL) console.log(x.toString());
      b=false;
      x.array.sort(function (a,b){return a[0]>b[0]?1:a[0]<b[0]?-1:0;});
      if (x.array.length>ExpantaNum.maxOps) x.array.splice(0,x.array.length-ExpantaNum.maxOps);
      if (!x.array.length) x.array=[[0,0]];
      if (x.array[x.array.length-1][0]>MAX_SAFE_INTEGER){
        x.layer++;
        x.array=[[0,x.array[x.array.length-1][0]]];
        b=true;
      }else if (x.layer&&x.array.length==1&&x.array[0][0]===0){
        x.layer--;
        if (x.array[0][1]===0) x.array=[[0,10]];
        else x.array=[[0,10],[Math.round(x.array[0][1]),1]];
        b=true;
      }
      if (x.array.length<ExpantaNum.maxOps&&x.array[0][0]!==0) x.array.unshift([0,10]);
      for (i=0;i<x.array.length-1;++i){
        if (x.array[i][0]==x.array[i+1][0]){
          x.array[i][1]+=x.array[i+1][1];
          x.array.splice(i+1,1);
          --i;
          b=true;
        }
      }
      if (x.array[0][0]===0&&x.array[0][1]>MAX_SAFE_INTEGER){
        if (x.array.length>=2&&x.array[1][0]==1){
          x.array[1][1]++;
        }else{
          x.array.splice(1,0,[1,1]);
        }
        x.array[0][1]=Math.log10(x.array[0][1]);
        b=true;
      }
      while (x.array.length>=2&&x.array[0][0]===0&&x.array[0][1]<MAX_E&&x.array[1][0]==1&&x.array[1][1]){
        x.array[0][1]=Math.pow(10,x.array[0][1]);
        if (x.array[1][1]>1){
          x.array[1][1]--;
        }else{
          x.array.splice(1,1);
        }
        b=true;
      }
      while (x.array.length>=2&&x.array[0][0]===0&&x.array[0][1]==1&&x.array[1][1]){
        if (x.array[1][1]>1){
          x.array[1][1]--;
        }else{
          x.array.splice(1,1);
        }
        x.array[0][1]=10;
      }
      if (x.array.length>=2&&x.array[0][0]===0&&x.array[1][0]!=1){
        if (x.array[0][1]) x.array.splice(1,0,[x.array[1][0]-1,x.array[0][1]]);
        x.array[0][1]=1;
        if (x.array[2][1]>1){
          x.array[2][1]--;
        }else{
          x.array.splice(2,1);
        }
        b=true;
      }
      for (i=1;i<x.array.length;++i){
        if (x.array[i][1]>MAX_SAFE_INTEGER){
          if (i!=x.array.length-1&&x.array[i+1][0]==x.array[i][0]+1){
            x.array[i+1][1]++;
          }else{
            x.array.splice(i+1,0,[x.array[i][0]+1,1]);
          }
          if (x.array[0][0]===0){
            x.array[0][1]=x.array[i][1]+1;
          }else{
            x.array.splice(0,0,[0,x.array[i][1]+1]);
          }
          x.array.splice(1,i);
          b=true;
        }
      }
    }while(b);
    if (!x.array.length) x.array=[[0,0]];
    return x;
  };
  P.toNumber=function (){
    //console.log(this.array);
    if (this.sign==-1) return -1*this.abs();
    if (this.array.length>=2&&(this.array[1][0]>=2||this.array[1][1]>=2||this.array[1][1]==1&&this.array[0][1]>Math.log10(Number.MAX_VALUE))) return Infinity;
    if (this.array.length>=2&&this.array[1][1]==1) return Math.pow(10,this.array[0][1]);
    return this.array[0][1];
  };
  P.toString=function (){
    if (this.sign==-1) return "-"+this.abs();
    if (isNaN(this.array[0][1])) return "NaN";
    if (!isFinite(this.array[0][1])) return "Infinity";
    var s="";
    if (!this.layer) s+="";
    else if (this.layer<3) s+="J".repeat(this.layer);
    else s+="J^"+this.layer+" ";
    if (this.array.length>=3||this.array.length==2&&this.array[1][0]>=2){
      for (var i=this.array.length-1;i>=2;--i){
        var e=this.array[i];
        var q=e[0]>=5?"{"+e[0]+"}":"^".repeat(e[0]);
        if (e[1]>1) s+="(10"+q+")^"+e[1]+" ";
        else if (e[1]==1) s+="10"+q;
      }
    }
    var op0=this.operator(0);
    var op1=this.operator(1);
    if (!op1) s+=String(op0);
    else if (op1<3) s+="e".repeat(op1-1)+Math.pow(10,op0-Math.floor(op0))+"e"+Math.floor(op0);
    else if (op1<8) s+="e".repeat(op1)+op0;
    else s+="(10^)^"+op1+" "+op0;
    return s;
  };
  //from break_eternity.js
  var decimalPlaces=function decimalPlaces(value,places){
    var len=places+1;
    var numDigits=Math.ceil(Math.log10(Math.abs(value)));
    var rounded=Math.round(value*Math.pow(10,len-numDigits))*Math.pow(10,numDigits-len);
    return parseFloat(rounded.toFixed(Math.max(len-numDigits,0)));
  };
  P.toStringWithDecimalPlaces=function (places,applyToOpNums){
    if (this.sign==-1) return "-"+this.abs();
    if (isNaN(this.array[0][1])) return "NaN";
    if (!isFinite(this.array[0][1])) return "Infinity";
    var b=0;
    var s="";
    var m=Math.pow(10,places);
    if (!this.layer) s+="";
    else if (this.layer<3) s+="J".repeat(this.layer);
    else s+="J^"+this.layer+" ";
    if (this.array.length>=3||this.array.length==2&&this.array[1][0]>=2){
      for (var i=this.array.length-1;!b&&i>=2;--i){
        var e=this.array[i];
        var w=e[0];
        var x=e[1];
        if (applyToOpNums&&x>=m){
          ++w;
          b=x;
          x=1;
        }else if (applyToOpNums&&this.array[i-1][0]==w-1&&this.array[i-1][1]>=m){
          ++x;
          b=this.array[i-1][1];
        }
        var q=w>=5?"{"+w+"}":"^".repeat(w);
        if (x>1) s+="(10"+q+")^"+x+" ";
        else if (x==1) s+="10"+q;
      }
    }
    var k=this.operator(0);
    var l=this.operator(1);
    if (k>m){
      k=Math.log10(k);
      ++l;
    }
    if (b) s+=decimalPlaces(b,places);
    else if (!l) s+=String(decimalPlaces(k,places));
    else if (l<3) s+="e".repeat(l-1)+decimalPlaces(Math.pow(10,k-Math.floor(k)),places)+"e"+decimalPlaces(Math.floor(k),places);
    else if (l<8) s+="e".repeat(l)+decimalPlaces(k,places);
    else if (applyToOpNums) s+="(10^)^"+decimalPlaces(l,places)+" "+decimalPlaces(k,places);
    else s+="(10^)^"+l+" "+decimalPlaces(k,places);
    return s;
  };
  //these are from break_eternity.js as well
  P.toExponential=function (places,applyToOpNums){
    if (this.array.length==1) return (this.sign*this.array[0][1]).toExponential(places);
    return this.toStringWithDecimalPlaces(places,applyToOpNums);
  };
  P.toFixed=function (places,applyToOpNums){
    if (this.array.length==1) return (this.sign*this.array[0][1]).toFixed(places);
    return this.toStringWithDecimalPlaces(places,applyToOpNums);
  };
  P.toPrecision=function (places,applyToOpNums){
    if (this.array[0][1]===0) return (this.sign*this.array[0][1]).toFixed(places-1,applyToOpNums);
    if (this.array.length==1&&this.array[0][1]<1e-6) return this.toExponential(places-1,applyToOpNums);
    if (this.array.length==1&&places>Math.log10(this.array[0][1])) return this.toFixed(places-Math.floor(Math.log10(this.array[0][1]))-1,applyToOpNums);
    return this.toExponential(places-1,applyToOpNums);
  };
  P.valueOf=function (){
    return this.toString();
  };
  //Note: toArray() would be impossible without changing the layout of the array or lose the information about the sign
  P.toJSON=function (){
    if (ExpantaNum.serializeMode==ExpantaNum.JSON){
      var a=[];
      for (var i=0;i<this.array.length;++i) a.push([this.array[i][0],this.array[i][1]]);
      return {
        array:a,
        layer:this.layer,
        sign:this.sign
      };
    }else if (ExpantaNum.serializeMode==ExpantaNum.STRING){
      return this.toString();
    }
  };
  P.toHyperE=function (){
    if (this.layer) throw Error(expantaNumError+"Sorry, but this prototype doesn't support correct Hyper-E notation for numbers larger than 10{MSI}10");
    if (this.sign==-1) return "-"+this.abs().toHyperE();
    if (isNaN(this.array[0][1])) return "NaN";
    if (!isFinite(this.array[0][1])) return "Infinity";
    if (this.lt(ExpantaNum.MAX_SAFE_INTEGER)) return String(this.array[0][1]);
    if (this.lt(ExpantaNum.E_MAX_SAFE_INTEGER)) return "E"+this.array[0][1];
    var r="E"+this.operator(0)+"#"+this.operator(1);
    var l=1;
    for (var i=Math.ceil(this.getOperatorIndex(2));i<this.array.length;++i){
      if (l+1<this.array[i][0]) r+="#1".repeat(this.array[i][0]-l-1);
      l=this.array[i][0];
      r+="#"+(this.array[i][1]+1);
    }
    if (!this.layer) r=""+r;
    else if (this.layer<3) r="J".repeat(this.layer)+r;
    else r="J^"+this.layer+" "+r;
    return r;
  };
  Q.fromNumber=function (input){
    if (typeof input!="number") throw Error(invalidArgument+"Expected Number");
    var x=new ExpantaNum();
    x.array[0][1]=Math.abs(input);
    x.sign=input<0?-1:1;
    x.standardize();
    return x;
  };
  Q.fromString=function (input){
    if (typeof input!="string") throw Error(invalidArgument+"Expected String");
    var isJSON=false;
    if (typeof input=="string"&&(input[0]=="["||input[0]=="{")){
      try {
        JSON.parse(input);
      }finally{
        isJSON=true;
      }
    }
    if (isJSON){
      return ExpantaNum.fromJSON(input);
    }
    var x=new ExpantaNum();
    x.array=[[0,0]];
    if (!isExpantaNum.test(input)){
      console.warn(expantaNumError+"Malformed input: "+input);
      x.array=[[0,NaN]];
      return x;
    }
    var negateIt=false;
    if (input[0]=="-"||input[0]=="+"){
      var numSigns=input.search(/[^-\+]/);
      var signs=input.substring(0,numSigns);
      negateIt=signs.match(/-/g).length%2==1;
      input=input.substring(numSigns);
    }
    if (input=="NaN") x.array=[[0,NaN]];
    else if (input=="Infinity") x.array=[[0,Infinity]];
    else{
      var a,b,c,d,i;
      if (input[0]=="J"){
        if (input[1]=="^"){
          a=input.substring(2).search(/[^0-9]/)+2;
          x.layer=Number(input.substring(2,a));
          input=input.substring(a+1);
        }else{
          a=input.search(/[^J]/);
          x.layer=a;
          input=input.substring(a);
        }
      }
      while (input){
        if (/^\(?10[\^\{]/.test(input)){
          if (input[0]=="("){
            input=input.substring(1);
          }
          var arrows;
          if (input[2]=="^"){
            a=input.substring(2).search(/[^\^]/);
            arrows=a;
            b=a+2;
          }else{
            a=input.indexOf("}");
            arrows=Number(input.substring(3,a));
            b=a+1;
          }
          input=input.substring(b);
          if (input[0]==")"){
            a=input.indexOf(" ");
            c=Number(input.substring(2,a));
            input=input.substring(a+1);
          }else{
            c=1;
          }
          if (arrows==1){
            if (x.array.length>=2&&x.array[1][0]==1){
              x.array[1][1]+=c;
            }else{
              x.array.splice(1,0,[1,c]);
            }
          }else if (arrows==2){
            a=x.array.length>=2&&x.array[1][0]==1?x.array[1][1]:0;
            b=x.array[0][1];
            if (b>=1e10) ++a;
            if (b>=10) ++a;
            x.array[0][1]=a;
            if (x.array.length>=2&&x.array[1][0]==1) x.array.splice(1,1);
            d=x.getOperatorIndex(2);
            if (Number.isInteger(d)) x.array[d][1]+=c;
            else x.array.splice(Math.ceil(d),0,[2,c]);
          }else{
            a=x.operator(arrows-1);
            b=x.operator(arrows-2);
            if (b>=10) ++a;
            d=x.getOperatorIndex(arrows);
            x.array.splice(1,Math.ceil(d)-1);
            x.array[0][1]=a;
            if (Number.isInteger(d)) x.array[1][1]+=c;
            else x.array.splice(1,0,[arrows,c]);
          }
        }else{
          break;
        }
      }
      a=input.split(/[Ee]/);
      b=[x.array[0][1],0];
      c=1;
      for (i=a.length-1;i>=0;--i){
        if (a[i]) d=Number(a[i]);
        else d=1;
        //The things that are already there
        if (b[0]<MAX_E&&b[1]===0){
          b[0]=Math.pow(10,c*b[0]);
        }else if (c==-1){
          if (b[1]===0){
            b[0]=Math.pow(10,c*b[0]);
          }else if (b[1]==1&&b[0]<=Math.log10(Number.MAX_VALUE)){
            b[0]=Math.pow(10,c*Math.pow(10,b[0]));
          }else{
            b[0]=0;
          }
          b[1]=0;
        }else{
          b[1]++;
        }
        //Multiplying coefficient
        if (b[1]===0){
          b[0]*=Number(d);
        }else if (b[1]==1){
          b[0]+=Math.log10(Number(d));
        }else if (b[1]==2&&b[0]<MAX_E+Math.log10(Math.log10(Number(d)))){
          b[0]+=Math.log10(1+Math.pow(10,Math.log10(Math.log10(Number(d)))-b[0]));
        }
        //Carrying
        if (b[0]<MAX_E&&b[1]){
          b[0]=Math.pow(10,b[0]);
          b[1]--;
        }else if (b[0]>MAX_SAFE_INTEGER){
          b[0]=Math.log10(b[0]);
          b[1]++;
        }
      }
      x.array[0][1]=b[0];
      if (b[1]){
        if (x.array.length>=2&&x.array[1][0]==1) x.array[1][1]+=b[1];
        else x.array.splice(1,0,[1,b[1]]);
      }
    }
    if (negateIt) x.sign*=-1;
    x.standardize();
    return x;
  };
  Q.fromArray=function (input1,input2,input3){
    var array,layer,sign;
    if (input1 instanceof Array&&(input2===undefined||typeof input2=="number")&&(input3===undefined||typeof input3=="number")){
      array=input1;
      sign=input2;
      layer=input3||0;
    }else if (typeof input1=="number"&&input2 instanceof Array&&(input3===undefined||typeof input3=="number")){
      array=input2;
      sign=input1;
      layer=input3||0;
    }else if (typeof input1=="number"&&typeof input2=="number"&&input3 instanceof Array){
      array=input3;
      sign=input1;
      layer=input2;
    }else{
      throw Error(invalidArgument+"Expected an Array [and 1 or 2 Number]");
    }
    var x=new ExpantaNum();
    var i;
    if (!array.length) x.array=[[0,0]];
    else if (typeof array[0]=="number"){
      x.array=[];
      for (i=0;i<array.length;i++){
        if (typeof array[i]!="number") throw Error(invalidArgument+"Expected Array of Number");
        x.array.push([i,array[i]]);
      }
    }else if (array[0] instanceof Array){
      x.array=[];
      for (i=0;i<array.length;i++){
        if (!(array[i] instanceof Array)||typeof array[i][0]!="number"||typeof array[i][1]!="number") throw Error(invalidArgument+"Expected Array of pair of Number");
        x.array.push([array[i][0],array[i][1]]);
      }
    }else throw Error(invalidArgument+"Expected Array of Number or Array of pair of Number");
    if (sign) x.sign=Number(sign);
    else x.sign=1;
    x.standardize();
    return x;
  };
  Q.fromObject=function (input){
    if (typeof input!="object") throw Error(invalidArgument+"Expected Object");
    if (input===null) return ExpantaNum.ZERO.clone();
    if (input instanceof Array) return ExpantaNum.fromArray(input);
    if (input instanceof ExpantaNum) return new ExpantaNum(input);
    if (!(input.array instanceof Array)) throw Error(invalidArgument+"Expected that property 'array' exists");
    if (input.sign!==undefined&&typeof input.sign!="number") throw Error(invalidArgument+"Expected that property 'sign' is Number");
    if (input.layer!==undefined&&typeof input.layer!="number") throw Error(invalidArgument+"Expected that property 'layer' is Number");
    return ExpantaNum.fromArray(input.array,input.sign,input.layer);
    /*var x=new ExpantaNum();
    x.array=[];
    for (var i=0;i<input.array.length;i++) x.array.push([input.array[i][0],input.array[i][1]]);
    x.sign=Number(input.sign)||1;
    x.layer=Number(input.layer)||0;
    x.standardize();
    return x;*/
  };
  Q.fromJSON=function (input){
    if (typeof input=="object") return ExpantaNum.fromObject(parsedObject);
    if (typeof input!="string") throw Error(invalidArgument+"Expected String");
    var parsedObject,x;
    try{
      parsedObject=JSON.parse(input);
    }catch(e){
      parsedObject=null;
      throw e;
    }finally{
      x=ExpantaNum.fromObject(parsedObject);
    }
    parsedObject=null;
    return x;
  };
  Q.fromHyperE=function (input){
    if (typeof input!="string") throw Error(invalidArgument+"Expected String");
    var x=new ExpantaNum();
    x.array=[[0,0]];
    if (!/^[-\+]*(0|[1-9]\d*(\.\d*)?|Infinity|NaN|E[1-9]\d*(\.\d*)?(#[1-9]\d*)*)$/.test(input)){
      console.warn(expantaNumError+"Malformed input: "+input);
      x.array=[[0,NaN]];
      return x;
    }
    var negateIt=false;
    if (input[0]=="-"||input[0]=="+"){
      var numSigns=input.search(/[^-\+]/);
      var signs=input.substring(0,numSigns);
      negateIt=signs.match(/-/g).length%2===0;
      input=input.substring(numSigns);
    }
    if (input=="NaN") x.array=[[0,NaN]];
    else if (input=="Infinity") x.array=[[0,Infinity]];
    else if (input[0]!="E"){
      x.array[0][1]=Number(input);
    }else if (input.indexOf("#")==-1){
      x.array[0][1]=Number(input.substring(1));
      x.array[1]=[1,1];
    }else{
      var array=input.substring(1).split("#");
      for (var i=0;i<array.length;++i){
        var t=Number(array[i]);
        if (i>=2){
          --t;
        }
        x.array[i]=[i,t];
      }
    }
    if (negateIt) x.sign*=-1;
    x.standardize();
    return x;
  };
  P.getOperatorIndex=function (i){
    if (typeof i!="number") i=Number(i);
    if (!isFinite(i)) throw Error(invalidArgument+"Index out of range.");
    var a=this.array;
    var min=0,max=a.length-1;
    if (a[max][0]<i) return max+0.5;
    if (a[min][0]>i) return -0.5;
    while (min!=max){
      if (a[min][0]==i) return min;
      if (a[max][0]==i) return max;
      var mid=Math.floor((min+max)/2);
      if (min==mid||a[mid][0]==i){
        min=mid;
        break;
      }
      if (a[mid][0]<i) min=mid;
      if (a[mid][0]>i) max=mid;
    }
    return a[min][0]==i?min:min+0.5;
  };
  P.getOperator=function (i){
    if (typeof i!="number") i=Number(i);
    if (!isFinite(i)) throw Error(invalidArgument+"Index out of range.");
    var ai=this.getOperatorIndex(i);
    if (Number.isInteger(ai)) return this.array[ai][1];
    else return i===0?10:0;
  };
  P.setOperator=function (i,value){
    if (typeof i!="number") i=Number(i);
    if (!isFinite(i)) throw Error(invalidArgument+"Index out of range.");
    var ai=this.getOperatorIndex(i);
    if (Number.isInteger(ai)) this.array[ai][1]=value;
    else{
      ai=Math.ceil(ai);
      this.array.splice(ai,0,[i,value]);
    }
    this.standardize();
  };
  P.operator=function (i,value){
    if (value===undefined) return this.getOperator(i);
    else this.setOperator(i,value);
  };
  P.clone=function (){
    var temp=new ExpantaNum();
    var array=[];
    for (var i=0;i<this.array.length;++i) array.push([this.array[i][0],this.array[i][1]]);
    temp.array=array;
    temp.sign=this.sign;
    temp.layer=this.layer;
    return temp;
  };
  // ExpantaNum methods

  /*
   *  clone
   *  config/set
   */

  /*
   * Create and return a ExpantaNum constructor with the same configuration properties as this ExpantaNum constructor.
   *
   */
  function clone(obj) {
    var i, p, ps;
    function ExpantaNum(input,input2) {
      var x=this;
      if (!(x instanceof ExpantaNum)) return new ExpantaNum(input,input2);
      x.constructor=ExpantaNum;
      var parsedObject=null;
      if (typeof input=="string"&&(input[0]=="["||input[0]=="{")){
        try {
          parsedObject=JSON.parse(input);
        }catch(e){
          //lol just keep going
        }
      }
      var temp,temp2,temp3;
      if (typeof input=="number"&&!(input2 instanceof Array)){
        temp=ExpantaNum.fromNumber(input);
      }else if (parsedObject){
        temp=ExpantaNum.fromObject(parsedObject);
      }else if (typeof input=="string"&&input[0]=="E"){
        temp=ExpantaNum.fromHyperE(input);
      }else if (typeof input=="string"){
        temp=ExpantaNum.fromString(input);
      }else if (input instanceof Array||input2 instanceof Array){
        temp=ExpantaNum.fromArray(input,input2);
      }else if (input instanceof ExpantaNum){
        temp=[];
        for (var i=0;i<input.array.length;++i) temp.push([input.array[i][0],input.array[i][1]]);
        temp2=input.sign;
        temp3=input.layer;
      }else if (typeof input=="object"){
        temp=ExpantaNum.fromObject(input);
      }else{
        temp=[[0,NaN]];
        temp2=1;
        temp3=0;
      }
      if (typeof temp2=="undefined"){
        x.array=temp.array;
        x.sign=temp.sign;
        x.layer=temp.layer;
      }else{
        x.array=temp;
        x.sign=temp2;
        x.layer=temp3;
      }
      return x;
    }
    ExpantaNum.prototype = P;

    ExpantaNum.JSON = 0;
    ExpantaNum.STRING = 1;
    
    ExpantaNum.NONE = 0;
    ExpantaNum.NORMAL = 1;
    ExpantaNum.ALL = 2;

    ExpantaNum.clone=clone;
    ExpantaNum.config=ExpantaNum.set=config;
    
    //ExpantaNum=Object.assign(ExpantaNum,Q);
    for (var prop in Q){
      if (Q.hasOwnProperty(prop)){
        ExpantaNum[prop]=Q[prop];
      }
    }
    
    if (obj === void 0) obj = {};
    if (obj) {
      ps = ['maxOps', 'serializeMode', 'debug'];
      for (i = 0; i < ps.length;) if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
    }

    ExpantaNum.config(obj);
    
    return ExpantaNum;
  }

  function defineConstants(obj){
    for (var prop in R){
      if (R.hasOwnProperty(prop)){
        if (Object.defineProperty){
          Object.defineProperty(obj,prop,{
            configurable: false,
            enumerable: true,
            writable: false,
            value: new ExpantaNum(R[prop])
          });
        }else{
          obj[prop]=new ExpantaNum(R[prop]);
        }
      }
    }
    return obj;
  }

  /*
   * Configure global settings for a ExpantaNum constructor.
   *
   * `obj` is an object with one or more of the following properties,
   *
   *   precision  {number}
   *   rounding   {number}
   *   toExpNeg   {number}
   *   toExpPos   {number}
   *
   * E.g. ExpantaNum.config({ precision: 20, rounding: 4 })
   *
   */
  function config(obj){
    if (!obj||typeof obj!=='object') {
      throw Error(expantaNumError+'Object expected');
    }
    var i,p,v,
      ps = [
        'maxOps',1,Number.MAX_SAFE_INTEGER,
        'serializeMode',0,1,
        'debug',0,2
      ];
    for (i = 0; i < ps.length; i += 3) {
      if ((v = obj[p = ps[i]]) !== void 0) {
        if (Math.floor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;
        else throw Error(invalidArgument + p + ': ' + v);
      }
    }

    return this;
  }


  // Create and configure initial ExpantaNum constructor.
  ExpantaNum=clone(ExpantaNum);

  ExpantaNum=defineConstants(ExpantaNum);

  ExpantaNum['default']=ExpantaNum.ExpantaNum=ExpantaNum;

  // Export.

  // AMD.
  if (typeof define == 'function' && define.amd) {
    define(function () {
      return ExpantaNum;
    });
  // Node and other environments that support module.exports.
  } else if (typeof module != 'undefined' && module.exports) {
    module.exports = ExpantaNum;
    // Browser.
  } else {
    if (!globalScope) {
      globalScope = typeof self != 'undefined' && self && self.self == self
        ? self : Function('return this')();
    }
    globalScope.ExpantaNum = ExpantaNum;
  }
})(this);
