for (var y=-30;y<=20;y++) console.log([y/10,Decimal.tetrate(10,y/10,1,true),OmegaNum.tetrate(10,y/10),ExpantaNum.tetrate(10,y/10)].join("\t"));

for (var y=-30;y<=20;y++) console.log([y/10,Decimal.pentate(10,y/10,1,true),OmegaNum.pentate(10,y/10),ExpantaNum.pentate(10,y/10)].join("\t"));

for (var y=-20;y<=20;y++) console.log([y/10,Decimal.slog(y/10,10,true),OmegaNum.slog(y/10),ExpantaNum.slog(y/10)].join("\t"));

for (var y=-20;y<=20;y++){
  var h=OmegaNum.slog(y/10);
  console.log([y/10,h,OmegaNum.tetr(10,h)].join("\t"));
}

var a=[];
for (var y=-30;y<=200;y++) a.push([y/5,OmegaNum.arrow(10,3,y/5)]);
console.table(a.map(([h,y])=>[h,y+"",OmegaNum.arrow_height_inverse(y,3,10).toNumber()]))

var a=[];
for (var y=-30;y<=200;y++) a.push([y/5,OmegaNum.arrow(10,4,y/5)]);
console.table(a.map(([h,y])=>[h,y+"",OmegaNum.arrow_height_inverse(y,4,10).toNumber()]))

var a=[];
for (var y=-30;y<=200;y++) a.push([y/5,ExpantaNum.arrow(10,3,y/5)]);
console.table(a.map(([h,y])=>[h,y+"",ExpantaNum.arrow_height_inverse(y,3,10).toNumber()]))

var a=[];
for (var y=-30;y<=200;y++) a.push([y/5,ExpantaNum.arrow(10,4,y/5)]);
console.table(a.map(([h,y])=>[h,y+"",ExpantaNum.arrow_height_inverse(y,4,10).toNumber()]))

var a=[];
for (var y=-30;y<=200;y++) a.push([y/5,ExpantaNum.arrow(10,1e20,y/5)]);
console.table(a.map(([h,y])=>[h,y+"",ExpantaNum.arrow_height_inverse(y,1e20,10).toNumber()]))

for (var y=0;y<=200;y++) console.log([y/100,Decimal.pentate(y/100,1000,1,true),OmegaNum.pentate(y/100,1000),ExpantaNum.pentate(y/100,1000)].join("\t"));

for (var y=0;y<=100;y++) console.log([y/10,Decimal.linear_sroot(y/10,3),OmegaNum.linear_sroot(y/10,3),ExpantaNum.linear_sroot(y/10,3)].join("\t"));


var a=[];
for (var y=0;y<=200;y++) a.push([y/5,OmegaNum.arrow(y/5,4,3)]);
console.table(a.map(([h,y])=>[h,y+"",OmegaNum.arrow_base_inverse(y,4,3).toNumber()]))